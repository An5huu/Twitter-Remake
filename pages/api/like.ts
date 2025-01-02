import { authenticateToken } from "../../lib/authenticateToken";
import type { CustomNextApiResponse } from "../../types";
import { NextApiRequest } from "next";
import prisma from '../../lib/prismaClient'

export default async function handler(req: NextApiRequest, res: CustomNextApiResponse) {
    if (req.method !== 'POST') return res.json({
        error: true,
        message: 'Method not allowed.'
    })

    const body = req.body
    
    if (!body['id']) return res.json({
        error: true,
        message: 'Missing post id'
    })

    const discordUser = await authenticateToken(req, res)

    try {
        const liked = await prisma.likes.findFirst({
            where: {
                userId: String(discordUser['id']),
                postId: body['id']
            }
        })   
        
        if (!liked) {
            await prisma.likes.create({
                data: {
                    userId: String(discordUser['id']),
                    postId: body['id']
                }
            })
        } else {
            await prisma.likes.delete({
                where: {
                    id: liked['id']
                }
            })
        }

        const post = await prisma.posts.findFirst({
            where: {
                id: body['id']
            },
            include: {
                likedBy: true
            }
        })

        res.socket.server.io?.emit('likes', {
            id: post!['id'],
            likes: post?.likedBy.length
        })
        
        return res.json({
            error: false,
            message: liked ? 'Successfully removed post from liked.' : 'Successfully liked post.'
        })
    } catch(e) {
        console.log(e)

        return res.json({
            error: true,
            message: 'Internal server error.'
        })
    }
}