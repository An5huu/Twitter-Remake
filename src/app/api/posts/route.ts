import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prismaClient";

export async function GET(request: NextRequest) {
    const headers = request.headers

    if (!headers.get('Authorization')) {
        return NextResponse.json({
            error: true,
            message: 'Authorization missing'
        })
    }

    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${headers.get('Authorization')}`
        }
    });

    if (!response.ok) {
        return NextResponse.json({
            error: true,
            message: 'Failed to fetch user from Discord'
        });
    }

    const discordUser = await response.json();

    if (!discordUser['id']) return NextResponse.json({
        error: true,
        message: 'Failed to fetch user from Discord'
    })

    const tweets = await prisma.posts.findMany({
        orderBy: {
            timestamp: 'desc'
        },
        take: 20,
        include: {
            likedBy: true
        }
    })

    const formattedTweets = tweets.map((tweet) => {
        const liked = tweet.likedBy.some((like) => like.userId === discordUser.id);

        const { likedBy, ...rest } = tweet;

        return {
            ...rest,
            likes: likedBy.length,
            liked
        };
    });

    return NextResponse.json({
        error: false,
        tweets: formattedTweets
    })
}