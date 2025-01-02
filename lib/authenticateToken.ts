import { NextApiRequest, NextApiResponse } from "next";

export async function authenticateToken(req: NextApiRequest, res: NextApiResponse) {
    const headers = req.headers
    
    if (!headers['authorization']) {
        return res.json({
            error: true,
            message: 'Authorization missing'
        })
    }

    const discordResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${headers['authorization']}`
        }
    });

    if (!discordResponse.ok) {
        return res.json({
            error: true,
            message: 'Failed to fetch user from Discord'
        });
    }

    const discordUser = await discordResponse.json();

    if (!discordUser['id'] || !discordUser['username']) return res.json({
        error: true,
        message: 'Failed to fetch user from Discord'
    })

    return discordUser
}