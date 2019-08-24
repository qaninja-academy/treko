import Task from './models/task';

import { publishToQueue } from './mqservice';

const defaultQueue = "tasks";

export default {
    create: (req, res) => {

        let task = new Task(req.body)

        task.save((err, data) => {
            if (!err) {
                // console.log(msg)
                let msg = { html: `<h1>Ninja Tasks:</h1><p>Tarefa ${task.title} criada com sucesso!</p>`, email: task.owner }
                publishToQueue(defaultQueue, JSON.stringify(msg));
                return res.status(200).json({ data: data })
            }

            if (err.name === "ValidationError") {
                return res.status(400).json(err)
            }

            return res.status(500).json(err)
        })
    },
    list: (req, res) => {
        let query = {}

        if (req.query.name) {
            query.name = new RegExp(req.query.name, 'i')
        }

        Task.find(query, {}, { sort: '-date' }, (err, result) => {
            return res.status(200).json({ data: result });
        })
    },
    get: (req, res) => {
        let id = req.params.id

        Task.findById({ _id: id }, {}, { sort: '-date' }, (err, result) => {
            if (!result) {
                return res.status(404).send(null);
            } else {
                return res.status(200).json({ data: result });
            }
        })
    },
    remove: (req, res) => {
        Task.findOneAndDelete({ _id: req.params.id }, (err, result) => {
            if (result) {
                return res.status(200).send(null);
            } else {
                return res.status(404).send(null);
            }
        })
    },
    update: (req, res) => {
        Task.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, result) => {
            if (result) {
                // console.log(result)
                let msg = { html: `<h1>Ninja Tasks:</h1><p>Tarefa ${result.title} concluída com sucesso!</p>`, email: result.owner }
                publishToQueue(defaultQueue, JSON.stringify(msg));
                return res.status(200).send(null);
            } else {
                return res.status(404).send(null);
            }
        })
    }
}