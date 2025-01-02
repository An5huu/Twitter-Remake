'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from 'axios';
import gsap from "gsap";

import { PostInterface } from "../../types";
import { io, Socket } from "socket.io-client";

import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";

let socket: Socket;

function timeAgo(dateTime: string): string {
    const now = new Date();
    const past = new Date(dateTime);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
    if (years > 0) return `${years}y`;

    const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
    if (months > 0) return `${months}m`;

    const weeks = Math.floor(diffInSeconds / (60 * 60 * 24 * 7));
    if (weeks > 0) return `${weeks}w`;

    const days = Math.floor(diffInSeconds / (60 * 60 * 24));
    if (days > 0) return `${days}d`;

    const hours = Math.floor(diffInSeconds / (60 * 60));
    if (hours > 0) return `${hours}h`;

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes > 0) return `${minutes}m`;

    return `${diffInSeconds}s`;
}

export default function Page() {
    const { data: session, status } = useSession({
        required: true
    });

    const [ postInputMenu, setPostInputMenu ] = useState<boolean>(false);
    const [ postInput, setPostInput ] = useState<string>('');

    const [ debounce, setDebounce ] = useState<boolean>(false);

    const [ tweetsToDisplay, setTweetsToDisplay ] = useState<PostInterface[]>([])

    useEffect(() => {
        socket = io({
            path: "/api/socket",
        });

        socket.on('post', (data) => {
            try {
                setTweetsToDisplay(p => [data, ...p].slice(0, 20))
            } catch(e) {
                console.log(e)
            }
        });

        socket.on('likes', (data) => {
            try {
                setTweetsToDisplay(p => p.map(t => t.id === data.id ? {...t, likes: data.likes} : {...t}))
            } catch(e) {
                console.log(e)
            }
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (postInputMenu) {
                gsap.to('#postMenu', { duration: 0.5, ease: 'power3.inOut', top: 0 });
            } else {
                gsap.to('#postMenu', { duration: 0.5, ease: 'power3.inOut', top: '100%' });
            }
        }
    }, [postInputMenu]);

    useEffect(() => {
        if (!session || !session.accessToken) return;
    
        async function fetchData() {
            try {
                const res = await axios.request({
                    method: 'GET',
                    url: '/api/posts',
                    headers: {
                        'Authorization': session?.accessToken
                    }
                });
    
                if (res.data.error) {
                    console.error('Error fetching tweets');
                } else {
                    setTweetsToDisplay(res.data.tweets);
                }
            } catch (err) {
                console.error(err);
            }
        }
    
        fetchData();
    }, [session]);
    
    if (status === 'loading') return (
        <>
            <Image src={'/Logo.png'} alt="Logo" width={40} height={40} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed" />
        </>
    )

    async function submitPost() {
        if (!session || !session.accessToken || postInput.length === 0 || debounce) return

        setDebounce(true)

        await axios.request({
            method: 'POST',
            url: '/api/post',
            data: {
                content: postInput
            },
            headers: {
                'Authorization': session?.accessToken
            }
        })
            .then(async (res) => {
                if (res['data']['error']) return console.error('Error posting tweet')

                setPostInput('')
                setPostInputMenu(false)
                setDebounce(false)
            })
            .catch(async (err) => {
                setDebounce(false)

                console.log(err)
            })
    }

    async function likePost(tweet: PostInterface) {
        if (!session || !session.accessToken) return

        await axios.request({
            method: 'POST',
            url: '/api/like',
            headers: {
                'Authorization': session?.accessToken
            },
            data: {
                id: tweet.id
            }
        })
            .then(async (res) => {
                if (!res.data['error']) {
                    setTweetsToDisplay(p => p.map(t => t.id === tweet.id ? {...t, liked: res.data['message'].includes('removed') ? false : true} : {...t}))
                }
            })
            .catch(async (e) => {
                console.log(e)
            })
    }

    return (
        <>
            <div className="flex flex-col justify-start items-center py-6 px-4 gap-5 w-screen h-screen fixed left-0 top-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-2/3 lg:w-1/2 overflow-auto border-l border-r border-[#171717]">
                <div className='w-full h-fit flex justify-between items-center'>
                    {session && <Image src={session.user.image || `https://eu.ui-avatars.com/api/?name=${session.user.name}&size=250`} alt='Profile' width={30} height={30} className="rounded-full cursor-pointer" />}
                    <Image src={'/Logo.png'} alt='Logo' width={30} height={30} className="cursor-pointer" onClick={() => window.location.reload()} />
                </div>
                <div className="invisible md:visible w-full min-h-20 h-auto flex flex-col justify-center items-end gap-2">
                    <textarea id="postInputPC" onChange={(e) => setPostInput(e.target.value)} value={postInput} placeholder="What's happening?" className="w-full h-full bg-transparent focus:outline-none placeholder:text-opacity-50 text-white font-semibold text-s"></textarea>
                    <button className="text-white text-sm font-semibold px-4 py-2 bg-[#1D9BF3] rounded-full opacity-50 transition-all ease-in duration-200" disabled={debounce || postInput.length === 0} style={{ opacity: postInput.length === 0 || debounce ? 0.5 : 1 }} onClick={async () => await submitPost()}>Post</button>
                </div>
                <div className="w-full min-h-[1px] bg-[#171717]" />
                {tweetsToDisplay.map((tweet, index) => (
                    <div key={index} className="w-full h-fit flex flex-col gap-5">
                        <div className="w-full flex justify-start items-start gap-2">
                            <Image src={`https://cdn.discordapp.com/avatars/${tweet.author}/${tweet.avatar}.png` || `https://eu.ui-avatars.com/api/${tweet.username}?name=&size=250`} alt='Profile' width={30} height={30} className="rounded-full" />
                            <div className="flex flex-col justify-start items-start">
                                <div className="flex justify-center items-center gap-2">
                                    <h1 className="text-white font-semibold text-sm">{tweet.username}</h1>
                                    <h1 className="text-white font-semibold text-xs text-opacity-50">@{tweet.username}</h1>
                                    <h1 className="text-white font-semibold text-xs text-opacity-50">{timeAgo(tweet.timestamp.toString())}</h1>
                                </div>
                                <p className="text-white font-medium text-sm text-opacity-80 mt-1">{tweet.content}</p>
                                <div className="flex justify-start items-center gap-1 mt-2 *:select-none cursor-pointer opacity-50 hover:opacity-100 transition-all ease-in duration-100" onClick={() => likePost(tweet)}>
                                    {tweet.liked ? <HeartSolid className="size-4 text-[#FF474C]" /> : <HeartOutline className="size-4 text-white" />}
                                    <p className="text-xs font-semibold" style={{ color: tweet.liked ? '#FF474C' : 'white' }}>{tweet.likes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-[#171717]" />
                    </div>
                ))}
            </div>

            <button onClick={() => setPostInputMenu(true)} className="fixed right-5 bottom-5 w-auto h-auto bg-[#1D9BF3] rounded-full flex justify-center items-center p-2 transition-all duration-200 ease-in active:scale-90 md:invisible">
                <PlusIcon className="size-6 text-white" />
            </button>

            <div id="postMenu" className="fixed left-0 top-[100%] w-screen h-screen bg-black flex flex-col justify-start items-center gap-2 p-6 md:invisible md:-z-50">
                <div className="w-full h-fit flex justify-between items-center">
                    <button className="text-white text-sm" onClick={() => setPostInputMenu(false)}>Cancel</button>
                    <button className="text-white text-sm font-semibold px-4 py-2 bg-[#1D9BF3] rounded-full opacity-50 transition-all ease-in duration-200" disabled={debounce || postInput.length === 0} style={{ opacity: postInput.length === 0 || debounce ? 0.5 : 1 }} onClick={async () => await submitPost()}>Post</button>
                </div>
                <textarea id="postInput" onChange={(e) => setPostInput(e.target.value)} value={postInput} placeholder="What's happening?" className="w-full h-full bg-transparent focus:outline-none placeholder:text-opacity-50 text-white font-semibold text-s"></textarea>
            </div>
        </>
    )
}