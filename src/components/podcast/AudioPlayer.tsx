import React, { Component } from 'react'
import ReactHowler from 'react-howler'

export default function AudioPlayer(podcastUrl: any) {
    const [isPlaying, setIsPlaying] = React.useState(false)

    const toggleAudio = () => {
        setIsPlaying(!isPlaying)
    }

    return (
        <ReactHowler
            playing={isPlaying}
            onPlay={toggleAudio}
            onPause={toggleAudio}
            onStop={toggleAudio}
            src='https://paperbrain-podcasts.s3.amazonaws.com/2401.08406.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARHJJ5JQXMWLDO5U3%2F20240401%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240401T190728Z&X-Amz-Expires=10000&X-Amz-SignedHeaders=host&X-Amz-Signature=d74b44a7dd1743a1ae9923c23dd3c0beb3e962728912f65c4728dd6cd1af0f99'
        />
    )
}