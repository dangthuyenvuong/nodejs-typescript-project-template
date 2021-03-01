import { NextFunction, Request, Response } from "express";
import mongoose, { Document, Model } from "mongoose";
import { objExclude } from "./helper";

export default class AbstractRestController {
    model: Model<Document>
    constructor(model: Model<Document>) {
        this.model = model

    }
    getOne = (req: Request, res: Response, next: NextFunction) => {
        let { _id } = req.params
        let { select } = req.query;


        let exec = this.model.findOne({ _id })

        if (select) {
            exec.select(select.toString().replace(/,/g, ' '))
        }


        exec.then(result => {
            return res.status(200).json({
                data: result,
            })
        })
            .catch(error => {
                return res.status(500).json({
                    message: error.message,
                    error
                })
            })
    }
    get = (req: Request, res: Response, next: NextFunction) => {
        let { sort = { _id: 'desc' }, limit = <any>'15', page = <any>'1', select } = req.query;

        let exec = this.model.find()

        if (select) {
            exec.select(select.toString().replace(/,/g, ' '))
        }

        page = parseInt(page)
        limit = parseInt(limit)

        if (page > 1) {
            exec.skip(limit * (page - 1))
        }

        exec.limit(limit)

        let paginate = {
            currentPage: page,
            perPage: limit,

        }

        Promise.all([
            exec.exec(),
            this.model.count(),
        ])
            .then(([data, count]) => {

                return res.status(200).json({
                    data,
                    paginate: {
                        ...paginate,
                        total: count,
                    }
                })
            })
    }
    post = (req: Request, res: Response, next: NextFunction) => {
        const data = new this.model({
            ...req.body,
            _id: new mongoose.Types.ObjectId(),

        })

        return data.save()
            .then((result) => res.status(201).json({
                data: result
            }))
            .catch((error) => res.status(500).json({
                message: error.message,
                error
            }))
    }
    put = (req: Request, res: Response, next: NextFunction) => {
        let { _id } = req.params

        this.model.updateOne({ _id }, {
            $set: objExclude(req.body, { createdAt: 1, updatedAt: 1 })
        }, { runValidators: true })
            .then((result) => {
                res.status(200).json({
                    data: result
                })
            }).catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                })
            })
    }
    delete = (req: Request, res: Response, next: NextFunction) => {
        let { _id } = req.params
        this.model.deleteOne({ _id })
            .then((result) => {
                res.status(200).json({
                    data: result
                })
            }).catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                })
            })
    }
}