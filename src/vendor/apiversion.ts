import { Express, Router } from "express";


type ApiVersion = {
    [i in string]: Router
}

type RouterVersion = { [k in string]: ApiVersion }



export default function apiversion(app: Express, routers: RouterVersion) {

    for (const i in routers) {

        for (const j in routers[i]) {
            app.use(`/${i}/${j}`, routers[i][j])
        }
    }
}