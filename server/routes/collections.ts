import express, { Request, Response as ExpressResponse } from 'express';
import { APIResponse } from '../types';

export const router = express.Router();

interface GetPathParams {
    contract: string;
}
interface GetQueryParams {
    readonly user?: string;
}

type GetResponse = APIResponse<string>;

router.get('/collections/:contract', async (
    req: Request<GetPathParams, {}, {}, GetQueryParams>,
    res: ExpressResponse<GetResponse>,
) => {
    const { contract } = req.params;

    return res.json({ success: true, data: 'success for ' + contract });
});
