---
title: "Why LLMs Cannot Replace Good Coders"
author: "ChatGPT & Benji Asperheim"
date: 2025-02-20
keywords: microsoft copilot, microsoft github copilot, github copilot, ai coding, ai to code, ai for coding, llm programming, code llm, ai that can code, op-ed, oped
slug: microsoft-copilot-ai-coding
thumbnail: github-copilot-ai-coding-ai-for-coding-512px.jpeg
description: "LLM programming, and tools like Microsoft Copilot, are not a replacement for foundational coding skills, but rather a means to enhance and augment them."
---

# Test

**The Proto-Germanic Masculine Nominative Singular Suffix \*-az: A Reconstruction and its Reflexes**

![AI Website Builder Screenshot of Web Page Builder](https://learnprogramming.us/cdn/angular-website-builder.gif)

##### Decorators for Relations

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
```

## More Tests

# Customize FFprobe Metadata Output as JSON

If you've worked with media files on the command line, you're probably familiar with [FFmpeg](https://ffmpeg.org/). But not everyone knows about its quieter, metadata-loving sibling: `ffprobe`.

In this article, you'll learn how to:

- Use `ffprobe` to extract structured metadata from video and image files
- Suppress the noisy banner output
- Format the output as JSON
- Use `jq` to extract just the fields you care about
- Wrap all of this in a Bash function for clean, reusable scripting

## What Is 'ffprobe' (and How Is It Different from 'ffmpeg')?

While `ffmpeg` is designed for **media processing** — transcoding, muxing, filtering, and converting — `ffprobe` is designed purely for **analyzing** media files. It gives you detailed information about formats, streams, codecs, resolution, colorspace, framerate, and embedded metadata.

| Tool      | Purpose                                 |
| --------- | --------------------------------------- |
| `ffmpeg`  | Edit, convert, stream, and encode media |
| `ffprobe` | Inspect media metadata only             |

Think of `ffprobe` as the `ffmpeg` version of `exiftool` for video, audio, and image containers.

## Key `ffprobe` Flags You Should Know

Here are a few of the most essential `ffprobe` flags:

| Flag                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| `-v quiet`           | Suppresses log output (like progress info)                       |
| `-hide_banner`       | Hides the FFmpeg build/version info                              |
| `-print_format json` | Outputs the metadata in JSON format                              |
| `-show_format`       | Displays container-level metadata (like format name, tags, etc.) |
| `-show_streams`      | Displays stream-level metadata (video/audio/image details)       |

You can combine these like so:

```bash
ffprobe -v quiet -hide_banner -print_format json -show_format -show_streams myfile.avif
```

## Why JSON? Why `jq`?

JSON is machine- and human-readable, and using tools like [`jq`](https://jqlang.org/) you can programmatically filter or extract exactly the data you need — no regex hacks, no fragile greps.

Here's how you can extract just the video codec and resolution of the first stream:

```bash
ffprobe -v quiet -hide_banner -print_format json \
  -show_streams myfile.avif | jq '.streams[0] | {codec_name, width, height}'
```

It should output something like this JSON:

```json
{
  "codec_name": "av1",
  "width": 1170,
  "height": 659
}
```

## Example: Extract Useful AVIF Metadata

Let's say you're working with `.avif` images and just want:

- The container format
- The `"compatible_brands"` tag
- Key per-stream info like `codec_name`, `pix_fmt`, and resolution
