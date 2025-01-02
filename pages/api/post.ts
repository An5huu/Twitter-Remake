import type { CustomNextApiResponse } from "../../types";
import { NextApiRequest } from "next";
import prisma from '../../lib/prismaClient'
import { authenticateToken } from "../../lib/authenticateToken";

export default async function handler(req: NextApiRequest, res: CustomNextApiResponse) {
    if (req.method !== 'POST') return res.json({
        error: true,
        message: 'Method not allowed.'
    })

    const body = req.body

    if (!body['content']) return res.json({
        error: true,
        message: 'Missing body content.'
    })
    
    const discordUser = await authenticateToken(req, res)

    try {
        const post = await prisma.posts.create({
            data: {
                username: discordUser['username'],
                avatar: discordUser['avatar'] || '',
                author: discordUser['id'],
                content: body['content']
            }
        })

        res.socket.server.io?.emit('post', post)
        
        return res.json({
            error: false,
            post
        })
    } catch(e) {
        console.error(e)

        return res.json({
            error: true,
            message: 'Failed to create post'
        })
    }
}