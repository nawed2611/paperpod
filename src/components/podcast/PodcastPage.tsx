"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, PlayCircle, SearchIcon, Wand2 } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SearchQuery from "../search/SearchQuery";
import SemanticSearchQuery from "../search/SemanticSearchQuery";
import HandleSearchMethod from "../search/handle-search-method";
import { Separator } from "@radix-ui/react-separator";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";
import { PaperProps } from "@/types/paper";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import axios from "axios";

// const samplePodcasts = {
//   "1": "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.14018.mp3",
//   "2": "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2403.16971.mp3",
//   "3": "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.15018.mp3",
//   "4": "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.16018.mp3",
//   "5": "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2312.10997.mp3"
// };

const samplePodcasts = [{
  title: "Collective Excitations of Self-Gravitating Bose-Einstein Condensates: Breathing Mode and Appearance of Anisotropy under Self-Gravity",
  id: "https://arxiv.org/pdf/2307.14018.pdf",
  summary: "We study the collective mode of self-gravitating Bose-Einstein condensates (BECs) described by the Gross-Pitaevskii-Poisson (GPP) equation. The self-gravitating BEC recently receives significant attention in cosmology and astrophysics as a candidate for dark matter. We investigate the breathing and anisotropic collective modes by numerically solving the GPP equation and using the variational method. The breathing mode shows that the period decreases with the total mass due to the density dependence of the self-gravitating BEC, which is quantitatively consistent with our analytical results. We also obtain an anisotropic collective mode, in which the quadrupole mode is coupled with the breathing mode. The period of the quadrupole mode has the same total mass dependence as that of the breathing mode. The characteristics of these periods are different from those of ordinary BECs trapped by an external potential. However, despite the difference in density dependence, their ratio is equal to that of the BEC trapped by an isotropic harmonic potential. Furthermore, a variational method extended to a spheroidal configuration shows that we extract only the quadrupole mode from the anisotropic collective mode.",
  url: "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.14018.mp3",
  date: "July 2023",
  authors: "Kenta Asakawa, Hideki Ishihara, Makoto Tsubota",
  image: "https://picsum.photos/200/300"
}, {
  title: "AIOS: LLM Agent Operating System",
  id: "https://arxiv.org/pdf/2403.16971.pdf",
  summary: "The integration and deployment of large language model (LLM)-based intelligent agents have been fraught with challenges that compromise their efficiency and efficacy. Among these issues are sub-optimal scheduling and resource allocation of agent requests over the LLM, the difficulties in maintaining context during interactions between agent and LLM, and the complexities inherent in integrating heterogeneous agents with different capabilities and specializations. The rapid increase of agent quantity and complexity further exacerbates these issues, often leading to bottlenecks and sub-optimal utilization of resources. Inspired by these challenges, this paper presents AIOS, an LLM agent operating system, which embeds large language model into operating systems (OS) as the brain of the OS, enabling an operating system `with soul` -- an important step towards AGI. Specifically, AIOS is designed to optimize resource allocation, facilitate context switch across agents, enable concurrent execution of agents, provide tool service for agents, and maintain access control for agents. We present the architecture of such an operating system, outline the core challenges it aims to resolve, and provide the basic design and implementation of the AIOS. Our experiments on concurrent execution of multiple agents demonstrate the reliability and efficiency of our AIOS modules. Through this, we aim to not only improve the performance and efficiency of LLM agents but also to pioneer for better development and deployment of the AIOS ecosystem in the future. The project is open-source at https://github.com/agiresearch/AIOS.",
  url: "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2403.16971.mp3",
  date: "March 2024",
  authors: "Kai Mei, Zelong Li, Shuyuan Xu, Ruosong Ye, Yingqiang Ge, Yongfeng Zhang",
  image: "https://picsum.photos/200/300"
}, {
  title: "Coupled thermoelastic isotropic laminates",
  id: "https://arxiv.org/pdf/2307.15018.pdf",
  summary: "We consider in this paper the general properties of laminates designed to be isotropic in extension and in bending and with a coupling between the in- and out-of plane responses. In particular, we analyze the mathematical properties of the tensors describing the elastic and thermal behavior and the mechanical consequences of these properties. The differences, from the mathematical and mechanical point of view, between the hybrid laminates, i.e. composed by layers of different materials, and those made of identical plies, are pointed out and analyzed. The polar formalism for planar tensors is used in this study.",
  url: "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.15018.mp3",
  date: "July 2023",
  authors: "Paolo Vannucci",
  image: "https://picsum.photos/200/300"
}, {
  title: "Moment indeterminateness: the Marcel Riesz variational principle",
  id: "https://arxiv.org/pdf/2307.16018.pdf",
  summary: "The discrete data encoded in the power moments of a positive measure, fast decaying at infinity on euclidean space, is incomplete for recovery, leading to the concept of moment indeterminateness. On the other hand, classical integral transforms (Fourier-Laplace, Fantappi`e, Poisson) of such measures are complete, often invertible via an effective inverse operation. The gap between the two non-uniqueness/ uniqueness phenomena is manifest in the dual picture, when trying to extend the measure, regarded as a positive linear functional, from the polynomial algebra to the full space of continuous functions. This point of view was advocated by Marcel Riesz a century ago, in the single real variable setting. Notable advances in functional analysis have root in Riesz' celebrated four notes devoted to the moment problem. A key technical ingredient being there the monotone approximation by polynomials of kernels of integral transforms. With inherent new obstacles we reappraise in the context of several real variables M. Riesz' variational principle. The result is an array of necessary and sufficient moment indeterminateness criteria, some raising real algebra questions, others involving intriguing analytic problems, all gravitating around the concept of moment separating function.",
  url: "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2307.16018.mp3",
  date: "July 2023",
  authors: "David P. Kimsey, Mihai Putinar",
  image: "https://picsum.photos/200/300",
}, {
  title: "Retrieval-Augmented Generation for Large Language Models: A Survey",
  id: "https://arxiv.org/pdf/2307.10997.pdf",
  summary: "Large Language Models (LLMs) showcase impressive capabilities but encounter challenges like hallucination, outdated knowledge, and non-transparent, untraceable reasoning processes. Retrieval-Augmented Generation (RAG) has emerged as a promising solution by incorporating knowledge from external databases. This enhances the accuracy and credibility of the generation, particularly for knowledge-intensive tasks, and allows for continuous knowledge updates and integration of domain-specific information. RAG synergistically merges LLMs' intrinsic knowledge with the vast, dynamic repositories of external databases. This comprehensive review paper offers a detailed examination of the progression of RAG paradigms, encompassing the Naive RAG, the Advanced RAG, and the Modular RAG. It meticulously scrutinizes the tripartite foundation of RAG frameworks, which includes the retrieval, the generation and the augmentation techniques. The paper highlights the state-of-the-art technologies embedded in each of these critical components, providing a profound understanding of the advancements in RAG systems. Furthermore, this paper introduces up-to-date evaluation framework and benchmark. At the end, this article delineates the challenges currently faced and points out prospective avenues for research and development.",
  url: "https://paperbrain-podcasts.s3.ap-south-1.amazonaws.com/2312.10997.mp3",
  date: "2023-07-14",
  authors: "PaYunfan Gao, Yun Xiong, Xinyu Gao, Kangxiang Jia, Jinliu Pan, Yuxi Bi, Yi Dai, Jiawei Sun, Meng Wang, Haofen WangerBrain",
  image: "https://picsum.photos/200/300",
}
];

export default function PodcastPage({ user, isSubscribed }: any) {
  const searchParams = useSearchParams();

  const [input, setInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paperURL, setPaperURL] = useState<string>("");
  const [response, setResponse] = useState<any>([]);
  const [podcastUrl, setPodcastUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleClick = (paperurl: string) => {
    setPaperURL(paperurl);

    // if (!isSubscribed) {
    //   toast.error("You need to upgrade to create a podcast!");
    //   return;
    // }

    axios
      .post(`https://ec2-43-204-96-49.ap-south-1.compute.amazonaws.com/podcast?paperurl=${paperurl}`)
      .then((res: any) => {
        console.log("data", res.data);
        toast.success("Your podcast is ready to listen!");
        setPodcastUrl(res.data.data.s3_url);
        console.log("s3_url", res.data.data.s3_url);
      })
      .catch((error: any) => {
        console.error("Fetch error:", error);
        toast.error("There was a problem. Please try again later.");
      });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);

      if (input.length == 0) {
        setResponse([]);
        setLoading(false);
        return;
      }

      fetch("/api/arxiv-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("data", data);
          setResponse(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Fetch error:", error);
        });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  // const playlist = [
  //   { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  //   { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  //   { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  //   { src: "https://paperbrain-podcasts.s3.amazonaws.com/2305.05516v2.mp3" },
  // ];

  // const [currentTrack, setTrackIndex] = useState(0);
  // const handleClickNext = () => {
  //   console.log("click next");
  //   setTrackIndex((currentTrack: any) =>
  //     currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
  //   );
  // };

  // const handleEnd = () => {
  //   console.log("end");
  //   setTrackIndex((currentTrack: any) =>
  //     currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
  //   );
  // };

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={35}>
          <div className="space-y-2 px-3 py-2">
            {/* <HandleSearchMethod /> */}
            <div className="inline-flex w-full gap-x-1 rounded-md border border-accent shadow-md dark:shadow-md dark:shadow-muted">
              <Button
                disabled
                variant="ghost"
                className="pl-2.5 pr-1 hover:bg-inherit"
              >
                <SearchIcon width={15} height={15} />
              </Button>
              <input
                type="text"
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search papers"
                className="w-full rounded-r-md bg-inherit px-1 text-sm outline-none"
              />
              {loading && (
                <div className="flex items-center justify-center px-2 text-emerald-600">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="size-5 animate-spin"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                  </svg>
                </div>
              )}
            </div>
            {response.length > 0 && <Separator />}

            <BentoGrid className="flex items-center">
              <div className={cn("h-[calc(100vh-5.5rem)] w-full overflow-y-scroll")}>
                {response.length !== 0 ? (
                  response.map((paper: PaperProps, i: number) => (
                    <div
                      key={paper.id}
                      className="m-2 flex flex-col space-y-1 rounded-lg border bg-transparent p-3"
                    >
                      <BentoGridItem
                        id={i + 1}
                        key={paper.id}
                        date={paper.date}
                        title={paper.title}
                        description={paper.summary}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        header={paper.authors}
                        className={
                          i === 3 ||
                            i === 6 ||
                            i === 10 ||
                            i === 13 ||
                            i === 17 ||
                            i === 20
                            ? "m-4 md:col-span-2"
                            : " m-4"
                        }
                      />

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" size="sm" className="w-fit">
                            Create Content <Wand2 className="ml-2 size-4" strokeWidth={1.5} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="flex-1 scrollbar-thin scrollbar-track-inherit scrollbar-thumb-accent scrollbar-corner-accent scrollbar-thumb-rounded">
                          <div className="flex flex-col items-center gap-2 pt-12">
                            <h1 className="flex items-center text-2xl font-bold">
                              Create Content{" "}
                              <Wand2 className="ml-2 size-4" strokeWidth={1} />
                            </h1>
                            <p className="w-5/6 text-pretty text-center text-sm text-muted-foreground">
                              We are excited to help you create content for your
                              research papers.
                            </p>
                          </div>


                          <h1 className="m-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-center font-serif text-xl tracking-tighter text-transparent">
                            {paper.title} <p className="italic ">By</p><p className="font-light">{paper.authors}, {paper.date}</p>
                          </h1>

                          <div className="flex flex-col gap-2 pt-2">
                            {/* <div className="flex flex-col items-center justify-center gap-2">
                              <p className="text-base font-medium">
                                Select the type of content you want to create
                              </p>
                              <p className="text-sm text-center w-3/4 text-muted-foreground">
                                You can share your research with your audience,
                                export your podcast and publish it on platforms like
                                Spotify, Apple Podcasts, and Google Podcasts through
                                PaperBrain.
                              </p>
                            </div> */}
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  handleClick(
                                    `https://export.arxiv.org/pdf/${paper.id
                                      .split("/")
                                      .pop()}.pdf`
                                  )
                                }
                                size="sm"
                              >
                                Submit Podcast Request
                              </Button>
                              <p className="w-3/4 pt-2 text-center text-sm text-muted-foreground">
                                This might take a few minutes. We will get back to you as soon as possible.
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <h1 className="m-4 flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-2xl font-semibold tracking-tighter text-transparent">
                      Start your research by listening to our podcasts!
                    </h1>
                  </div>
                )}
              </div>
            </BentoGrid>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={50}>
          <div className="flex flex-col items-center gap-2">
            <h1 className="m-4 flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-2xl font-semibold tracking-tighter text-transparent">
              Your Podcasts
            </h1>

          </div>
          <BentoGrid className="flex items-center">
            <div className={cn("flex h-[calc(100vh-5.5rem)] flex-wrap overflow-y-scroll")}>
              {samplePodcasts.length !== 0 ? (
                samplePodcasts.map((paper: any, i: number) => (
                  <div
                    key={paper.id}
                    className="m-2 flex flex-col space-y-1 rounded-lg border hover:bg-muted/60 p-3"
                  >
                    <BentoGridItem
                      id={paper.id}
                      key={paper.id}
                      date={paper.date}
                      title={paper.title}
                      description={paper.summary}
                      header={paper.authors}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      podcastUrl={paper.url}
                      sample={true}
                    />

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <h1 className="m-4 flex items-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text pt-4 text-center font-sans text-2xl font-semibold tracking-tighter text-transparent">
                    Start your research by listening to our podcasts!
                  </h1>
                </div>
              )}
            </div>
          </BentoGrid>
        </ResizablePanel >
      </ResizablePanelGroup >
      <div className="absolute bottom-0 w-[calc(100vw-4rem)]">
        {/* <AudioPlayer
          volume={0.5}
          src={playlist[currentTrack].src}
          showSkipControls
          onClickNext={handleClickNext}
          onEnded={handleEnd}
          onError={() => {
            console.log("play error");
          }}

        // Try other props!
        /> */}
        {
          podcastUrl && <AudioPlayer
            volume={0.5}
            src={podcastUrl}
            showSkipControls
            onError={() => {
              console.log("play error");
            }}
          />

          // Try other props!
        }
      </div>
    </>
  );
}
