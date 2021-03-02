import Department from '../models/Department';

import AbstractRestController from "../vendor/AbstractRestController";


class Controller extends AbstractRestController {
    constructor() {
        super(Department)
    }
}

export default new Controller()