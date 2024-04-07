# PaperPod

Listen to your research papers like never before! Explore the scientific literature with PaperPod.

## Features

- Explore research papers have never been easier!
- Listen to your favorite research papers on the go!
- Create content and share it with the world!
- Upload your research papers to gain access to our PaperBrain Assistant.

## Getting Started

1. Visit the [PaperPod website](https://paperbrain.org) and sign up for an account. You will be redirected to the dashboard where you can start exploring research papers.

## Inspiration

If you're coming from a research background, you must have stumbled upon Google Scholar's messy UI, scrolled on websites blocked by paywalls, or prompted to download the research paper. Introducing PaperPod, a platform to listen to your favorite research papers on the go. Create content from the papers you read and share it with the world. We believe that research papers are the most fun piece of content you can read and therefore we are excited to bring this to you.

## What it does

Our platform is the go-to platform for accessing and understanding research papers. We provide a fascinating interface for users to search for papers and return a list of papers with their abstracts and a direct pdf link in a prettified format.

Since research papers are generally difficult to understand, we have added an exclusive custom trained chatbot to chat with the papers and understand them better.

## How we built it

We used Next.js for the frontend and FastAPI for the backend. We also used Pinecone for semantic search and Whisper for generating podcasts. We used Redis PubSub to integrate the queueing system and save the generated podcasts in the database. We also used Kinde's secure authentication to secure the app. We're using Supabase as our database client.

## Challenges we ran into

We faced quite a lot of challenges in building this project during the hackathon.

1. Integrating FastAPI with a Next.js client running with TypeScript type support.
2. Adding Kinde's secure authentication into the app.
3. Embedding PDF using Pinecone and using their namespaces to embed papers on the arxiv library.
4. Podcasts are heavy generation process and we had to use Redis PubSub to use their queueing system and save the generated podcasts in the database. This is a very heavy process and we had to optimize it.
5. We had to use Whisper model to generate the podcasts and it was a bit of a challenge to get it working with Redis PubSub.

## Accomplishments that we're proud of

We are proud to have implemented the idea we thought of at the beginning of the hackathon.

1. It was our first time working with Redis PubSub and it was a great learning experience and integrating it into our FastAPI backend.

## What we learned

1. Learnt so many new tools over the weekend like Next.js integration w/ FastAPI and Open AI
2. Worked on Whisper model bugs as well
3. Built a simple yet elegant UI using Next.js
4. Embedding PDFs into the app
5. Integrating Pinecone for semantic search

## What's next for paperpod

Work on a bookmark feature
