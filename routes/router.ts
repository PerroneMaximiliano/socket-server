import { Router, Request, Response } from 'express';
import Server from '../class/server';
import { usersConnected } from '../sockets/socket';

const router = Router();

router.get('/message', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Funcionando bien.'
    });
});

router.post('/message', (req: Request, res: Response) => {
    const message = req.body.message;
    const to = req.body.to;
    const payload = {message, to};
    const server = Server.instance;

    server.io.emit('new-message', payload);

    res.json({
        ok: true,
        message,
        to
    });
});

router.post('/message/:id', (req: Request, res: Response) => {
    const message = req.body.message;
    const to = req.body.to;
    const id = req.params.id;
    const payload ={message, to};
    const server = Server.instance;

    server.io.in(id).emit('message-private', payload);

    res.json({
        ok: true,
        message,
        to,
        id
    });
});

// get all ids of the users
router.get('/users', (req: Request, res: Response) => {
    const server = Server.instance;

    server.io.clients((err: any, clients: string[]) => {
        if (err) {
            res.json({
                ok: false, err
            });
        }

        res.json({
            ok: true, clients
        });
    });
});

// get users and names
router.get('/users/detail', (req: Request, res: Response) => {
    res.json({
        ok: true,
        clients: usersConnected.getList()
    })
});

export default router;