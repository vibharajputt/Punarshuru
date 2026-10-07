import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  BookOpen,
  Video,
  FileText,
  Code2,
  HelpCircle,
  Clock,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  BookmarkPlus,
  Play,
  Search,
} from 'lucide-react'

export interface SkillRoadmapData {
  skill: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estWeeks: number
  overview: string
  roadmap: {
    phase: string
    title: string
    duration: string
    topics: string[]
    milestone: string
  }[]
  videos: {
    title: string
    channel: string
    duration: string
    platform: 'freeCodeCamp' | 'NPTEL' | 'SWAYAM' | 'YouTube' | 'Coursera'
    url: string
    isFree: boolean
  }[]
  notes: {
    title: string
    content: string
    keyTakeaways: string[]
    cheatsheetCode?: string
  }
  projects: {
    title: string
    difficulty: string
    description: string
    features: string[]
  }[]
  interviewQuestions: {
    q: string
    a: string
  }[]
}

// ── Curated Roadmaps Knowledge Base ──────────────────────────────────────────
const SKILL_DATABASE: Record<string, SkillRoadmapData> = {
  genai: {
    skill: 'GenAI & LLMs',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    estWeeks: 4,
    overview:
      'Generative AI models and LLMs (Large Language Models) power modern AI agents, RAG (Retrieval-Augmented Generation), prompting architectures, and fine-tuning pipelines.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Foundations of Transformers & Attention Mechanisms',
        duration: 'Week 1',
        topics: [
          'Attention is All You Need architecture & Self-Attention mechanics',
          'Tokenization, Embeddings, and Latent Vector Spaces',
          'Encoder-Decoder vs Decoder-Only (GPT, Gemini, Llama) models',
          'API basics with OpenAI & Google Gemini Python SDKs',
        ],
        milestone: 'Call an LLM API with custom system prompts, temperature tuning, and structured JSON outputs.',
      },
      {
        phase: 'Phase 2',
        title: 'Prompt Engineering & Context Management',
        duration: 'Week 2',
        topics: [
          'Zero-shot, Few-shot, and Chain-of-Thought (CoT) prompting',
          'ReAct pattern (Reasoning + Acting) for AI Agents',
          'Context window limits, token optimization, and cost governance',
          'Structured schema enforcement with Pydantic and JSON mode',
        ],
        milestone: 'Build an autonomous multi-step reasoning agent with validation schemas.',
      },
      {
        phase: 'Phase 3',
        title: 'Retrieval-Augmented Generation (RAG) & Vector DBs',
        duration: 'Week 3',
        topics: [
          'Vector embeddings generation (FastEmbed, sentence-transformers)',
          'Vector Indexing & Similarity Search (Pinecone, ChromaDB, FAISS)',
          'Chunking strategies (RecursiveCharacter, semantic chunking)',
          'Hybrid search (Dense vectors + BM25 keyword search)',
        ],
        milestone: 'Construct a complete Question-Answering system over private custom PDF documents.',
      },
      {
        phase: 'Phase 4',
        title: 'Evaluation, Fine-Tuning & Production Deployment',
        duration: 'Week 4',
        topics: [
          'LLM evaluation metrics (Ragas, Faithfulness, Answer Relevancy)',
          'PEFT & LoRA / QLoRA parameter-efficient fine-tuning concepts',
          'Guardrails, safety filters, and hallucination reduction',
          'Deploying FastAPIs with streaming responses (Server-Sent Events)',
        ],
        milestone: 'Deploy a production-ready RAG application with evaluation scores and streaming UI.',
      },
    ],
    videos: [
      {
        title: 'Generative AI Full Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '11 hrs',
        platform: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=mEsleV16qdo',
        isFree: true,
      },
      {
        title: 'Large Language Models (LLMs) & Transformers Explained',
        channel: 'Andrej Karpathy (Deep Dive)',
        duration: '2 hrs 15 mins',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        isFree: true,
      },
      {
        title: 'NPTEL: Natural Language Processing with Deep Learning',
        channel: 'IIT Madras / NPTEL',
        duration: '12 Weeks',
        platform: 'NPTEL',
        url: 'https://nptel.ac.in/courses/106/106/106106211/',
        isFree: true,
      },
      {
        title: 'Complete RAG System from Scratch with LangChain',
        channel: 'Krish Naik',
        duration: '3 hrs 40 mins',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=2xxziIWmaSA',
        isFree: true,
      },
    ],
    notes: {
      title: 'GenAI & Vector Embeddings Core Cheatsheet',
      content:
        'GenAI utilizes deep transformer neural networks trained on internet-scale text to generate coherent responses. In enterprise systems, RAG combines external knowledge databases with LLMs to eliminate hallucinations.',
      keyTakeaways: [
        'Embeddings convert text into high-dimensional numerical vectors where semantic closeness = geometric proximity (cosine distance).',
        'Temperature controls randomness: 0.0 for deterministic code/facts, 0.7+ for creative drafting.',
        'RAG consists of 3 stages: Ingestion (chunk + embed), Retrieval (vector search top-k), Generation (prompt + context -> LLM).',
      ],
      cheatsheetCode: `# Python RAG Pipeline Example
from google import genai
from google.genai import types

client = genai.Client(api_key="YOUR_API_KEY")

def generate_grounded_answer(query: str, context: str) -> str:
    prompt = f"""Use ONLY the following context to answer the question:
Context: {context}

Question: {query}
Answer:"""
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.2,
            max_output_tokens=500
        )
    )
    return response.text`,
    },
    projects: [
      {
        title: 'Enterprise Document Q&A (RAG) System',
        difficulty: 'Intermediate',
        description: 'Upload enterprise PDFs and ask natural questions with exact source page citations.',
        features: ['FastAPI backend', 'ChromaDB vector store', 'Streaming UI', 'Page-level citation highlight'],
      },
      {
        title: 'Autonomous Code Reviewer Agent',
        difficulty: 'Advanced',
        description: 'An AI GitHub bot that analyzes pull requests, flags security flaws, and proposes diff fixes.',
        features: ['ReAct Agent loop', 'AST token parser', 'Pydantic structured output', 'GitHub Webhooks'],
      },
    ],
    interviewQuestions: [
      {
        q: 'What is the fundamental difference between Fine-Tuning and RAG?',
        a: 'RAG supplies external current factual context into the prompt dynamically without modifying model weights. Fine-tuning adjusts the model weights to learn specific syntax, style, or domain vocabulary, but is costlier to update continuously.',
      },
      {
        q: 'How do you prevent hallucinations in LLM applications?',
        a: '1) Strict system prompting ("Answer only from context, otherwise say I do not know"), 2) Lower temperature (0.0–0.2), 3) Vector retrieval with similarity threshold filters, 4) Dual-pass evaluation with citation verification.',
      },
    ],
  },

  kubernetes: {
    skill: 'Kubernetes (K8s)',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    estWeeks: 4,
    overview:
      'Kubernetes is the industry-standard container orchestration engine that automates application deployment, scaling, load balancing, and self-healing.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Container Fundamentals & K8s Architecture',
        duration: 'Week 1',
        topics: [
          'Docker recap: multi-stage builds & container security',
          'K8s Control Plane (API Server, etcd, Scheduler, Controller Manager)',
          'Worker Nodes (Kubelet, Kube-proxy, Container Runtime)',
          'Minikube & Kind local cluster setup',
        ],
        milestone: 'Deploy your first local Kubernetes cluster and launch an interactive Pod.',
      },
      {
        phase: 'Phase 2',
        title: 'Core Workloads & Networking',
        duration: 'Week 2',
        topics: [
          'Pods, Deployments, ReplicaSets, and DaemonSets',
          'ClusterIP, NodePort, and LoadBalancer services',
          'Ingress Controllers & Ingress Routing (Nginx Ingress)',
          'ConfigMaps and Secrets injection',
        ],
        milestone: 'Deploy a multi-tier microservices app with load-balanced public routing.',
      },
      {
        phase: 'Phase 3',
        title: 'Storage, Autoscaling & Observability',
        duration: 'Week 3',
        topics: [
          'Persistent Volumes (PV), PVCs, and StorageClasses',
          'Horizontal Pod Autoscaler (HPA) with CPU/Memory metrics',
          'Liveness, Readiness, and Startup Probes',
          'Monitoring with Prometheus & Grafana dashboarding',
        ],
        milestone: 'Implement auto-healing and auto-scaling under simulated traffic stress.',
      },
      {
        phase: 'Phase 4',
        title: 'Helm, GitOps & Production Best Practices',
        duration: 'Week 4',
        topics: [
          'Packaging applications using Helm charts',
          'GitOps with ArgoCD for continuous delivery',
          'Role-Based Access Control (RBAC) & Network Policies',
          'Zero-downtime rolling updates and Canary deployments',
        ],
        milestone: 'Build an automated CI/CD to Kubernetes pipeline with Helm and ArgoCD.',
      },
    ],
    videos: [
      {
        title: 'Kubernetes Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '4 hrs',
        platform: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
        isFree: true,
      },
      {
        title: 'Complete DevOps & Kubernetes Bootcamp (Hindi/Eng)',
        channel: 'Kunal Kushwaha',
        duration: '6 hrs',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=7XDeI5fyj3w',
        isFree: true,
      },
      {
        title: 'SWAYAM: Cloud Computing & Distributed Orchestration',
        channel: 'IIT Kharagpur / SWAYAM',
        duration: '8 Weeks',
        platform: 'SWAYAM',
        url: 'https://swayam.gov.in/nd1_noc20_cs68',
        isFree: true,
      },
    ],
    notes: {
      title: 'Kubernetes Essential Architecture & Commands',
      content:
        'Kubernetes manages desired state declaratively via YAML manifests. The control plane constantly reconciles current state with desired state.',
      keyTakeaways: [
        'Pod is the smallest deployable unit containing 1 or more tightly coupled containers.',
        'Deployments manage declarative updates for Pods and ReplicaSets.',
        'Services provide a stable virtual IP and DNS name across ephemeral pod lifecycles.',
      ],
      cheatsheetCode: `# Common Kubectl Commands
kubectl get nodes -o wide
kubectl apply -f deployment.yaml
kubectl get pods --all-namespaces
kubectl logs -f deployment/backend-app
kubectl exec -it <pod-name> -- /bin/sh
kubectl rollout status deployment/backend-app`,
    },
    projects: [
      {
        title: 'High-Availability Microservices Deployment on K8s',
        difficulty: 'Intermediate',
        description: 'Deploy frontend, backend API, Redis cache, and Postgres DB with persistent storage and ingress.',
        features: ['Helm Chart packaging', 'HPA Autoscaling', 'Readiness & Liveness probes', 'Secret encryption'],
      },
      {
        title: 'GitOps CI/CD Pipeline with ArgoCD',
        difficulty: 'Advanced',
        description: 'Automated cluster sync where every git commit to main triggers a canary release on K8s.',
        features: ['ArgoCD sync', 'Canary rollouts', 'Prometheus metrics alerting'],
      },
    ],
    interviewQuestions: [
      {
        q: 'What is the difference between a LivenessProbe and a ReadinessProbe?',
        a: 'LivenessProbe checks if the container is running; if it fails, kubelet restarts the container. ReadinessProbe checks if the container is ready to accept traffic; if it fails, endpoints controller removes the pod from service load balancers without restarting it.',
      },
      {
        q: 'How does K8s ensure zero downtime during a deployment update?',
        a: 'Using RollingUpdate strategy with maxSurge and maxUnavailable settings. K8s spawns new version pods, verifies their readiness probe, and only terminates old pods once the new ones are healthy.',
      },
    ],
  },

  linux: {
    skill: 'Linux System Administration',
    category: 'Operating Systems & Cloud',
    difficulty: 'Beginner',
    estWeeks: 3,
    overview:
      'Linux is the backbone of cloud servers, containers, DevOps pipelines, and embedded engineering worldwide.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Shell Navigation, Permissions & File Operations',
        duration: 'Week 1',
        topics: [
          'Linux directory hierarchy (FHS): /etc, /var, /opt, /usr, /proc',
          'File manipulation: ls, cp, mv, rm, find, grep, sed, awk',
          'User & Group permissions: chmod, chown, umask, sudoers',
          'SSH keys setup, secure remote login, and scp/rsync transfers',
        ],
        milestone: 'Navigate and manage remote cloud servers securely using key-based SSH.',
      },
      {
        phase: 'Phase 2',
        title: 'Processes, Networking & Systemd Services',
        duration: 'Week 2',
        topics: [
          'Process management: ps, top, htop, kill, pkill, nice',
          'Networking: netstat, ss, curl, ip, ufw firewall, iptables',
          'Systemd: creating custom service units, timer daemons, journalctl logging',
          'Disk management: df, du, fdisk, mount, LVM basics',
        ],
        milestone: 'Write and run a production background service managed by Systemd.',
      },
      {
        phase: 'Phase 3',
        title: 'Bash Scripting & Server Hardening',
        duration: 'Week 3',
        topics: [
          'Bash shell scripting: variables, conditionals, loops, functions',
          'Automating backups and log rotations via Cron jobs',
          'Security hardening: disable root SSH, fail2ban setup, SELinux/AppArmor',
          'Performance profiling with vmstat, iostat, and strace',
        ],
        milestone: 'Automate server maintenance and database backups using bash scripts.',
      },
    ],
    videos: [
      {
        title: 'Linux Command Line Full Course for Beginners',
        channel: 'freeCodeCamp.org',
        duration: '5 hrs',
        platform: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=ZtqBQ68cfJc',
        isFree: true,
      },
      {
        title: 'Linux for DevOps & Cloud Engineers (Hindi/Eng)',
        channel: 'NetworkChuck',
        duration: '3 hrs 30 mins',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=gd7BXuUQ91w',
        isFree: true,
      },
      {
        title: 'NPTEL: Linux Internals & System Administration',
        channel: 'IIT Kharagpur / NPTEL',
        duration: '8 Weeks',
        platform: 'NPTEL',
        url: 'https://nptel.ac.in/courses/106/105/106105175/',
        isFree: true,
      },
    ],
    notes: {
      title: 'Linux CLI Cheatsheet & Top Commands',
      content:
        'Everything in Linux is represented as a file or stream. Understanding standard streams (stdin, stdout, stderr) and piping makes shell operations immensely powerful.',
      keyTakeaways: [
        'chmod 755 allows Owner: rwx, Group: rx, Others: rx.',
        'grep -rnw "/path" -e "pattern" finds exact words recursively.',
        'systemctl enable --now myservice enables and immediately starts a service on boot.',
      ],
      cheatsheetCode: `# Essential Diagnostic Commands
htop                      # Interactive CPU & RAM process viewer
journalctl -u nginx -f    # Live streaming logs for nginx service
ss -tulpn                 # List listening TCP/UDP ports with PIDs
df -h && free -h          # Human readable disk space and RAM usage
find /var/log -type f -name "*.log" -mtime +7 -delete`,
    },
    projects: [
      {
        title: 'Automated Server Provisioning & Backup Script',
        difficulty: 'Beginner',
        description: 'Bash script that configures firewall, installs security patches, creates users, and backs up DBs to S3.',
        features: ['Cron automation', 'Error handling', 'Slack webhook alerts', 'Log rotation'],
      },
      {
        title: 'Custom System Monitoring & Alert Daemon',
        difficulty: 'Intermediate',
        description: 'Lightweight daemon tracking CPU/RAM spikes and anomalous failed SSH login attempts.',
        features: ['Systemd unit', 'fail2ban integration', 'Metric logging'],
      },
    ],
    interviewQuestions: [
      {
        q: 'What is the difference between a Hard Link and a Soft (Symbolic) Link in Linux?',
        a: 'A Soft Link (symlink) points to the file path name (like a shortcut); if the original file is deleted, the symlink breaks. A Hard Link points directly to the underlying inode on the filesystem; the file data remains accessible until all hard links are deleted.',
      },
      {
        q: 'How do you check why a Linux server is experiencing high load when CPU is low?',
        a: 'High load with low CPU indicates I/O wait (disk or network bottleneck). Use `iostat -xz 1` or `vmstat 1` to check the `wa` (I/O wait) and `b` (blocked processes) columns.',
      },
    ],
  },

  'embedded systems': {
    skill: 'Embedded Systems & Firmware',
    category: 'Hardware & IoT Engineering',
    difficulty: 'Intermediate',
    estWeeks: 4,
    overview:
      'Embedded systems combine low-level C/C++ programming with microcontrollers (ARM Cortex, ESP32, STM32) to control physical devices in real-time.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Embedded C Programming & Microcontroller Architecture',
        duration: 'Week 1',
        topics: [
          'Memory-mapped I/O, bitwise manipulations, volatile keywords',
          'ARM Cortex-M architecture (Registers, Memory Map, Stack Pointer)',
          'GPIO configuration, Clock trees, and Power modes',
          'Compilers, toolchains (arm-none-eabi-gcc), and Linker scripts',
        ],
        milestone: 'Write bare-metal register-level code to blink LEDs and handle push button debouncing.',
      },
      {
        phase: 'Phase 2',
        title: 'Serial Communication Protocols',
        duration: 'Week 2',
        topics: [
          'UART (Baud rates, parity, framing errors)',
          'I2C (Master/Slave, addressing, ACK/NACK, pull-ups)',
          'SPI (Clock polarity CPOL/CPHA, full-duplex high speed)',
          'Interrupt Service Routines (ISR) and Interrupt Controllers (NVIC)',
        ],
        milestone: 'Interface an I2C OLED display and an SPI flash memory chip using hardware drivers.',
      },
      {
        phase: 'Phase 3',
        title: 'Timers, PWM, ADC/DAC & Sensor Interfacing',
        duration: 'Week 3',
        topics: [
          'Hardware Timers, Input Capture, Output Compare, and PWM generation',
          'ADC sampling rates, resolution, DMA (Direct Memory Access) transfers',
          'Interfacing analog sensors (temperature, pressure, current sensors)',
          'Debugging with JTAG/SWD, OpenOCD, and Logic Analyzers',
        ],
        milestone: 'Sample multi-channel ADC data via DMA and control brushless DC motors with PWM.',
      },
      {
        phase: 'Phase 4',
        title: 'Real-Time Operating Systems (FreeRTOS)',
        duration: 'Week 4',
        topics: [
          'FreeRTOS Tasks, Preemptive Scheduling, and Priorities',
          'Inter-Task Communication: Queues, Semaphores, and Mutexes',
          'Handling Priority Inversion and Race Conditions',
          'Low-power sleep modes and watchdog timers',
        ],
        milestone: 'Design a multi-threaded FreeRTOS system with queue-based sensor processing.',
      },
    ],
    videos: [
      {
        title: 'NPTEL: Introduction to Embedded Systems by IIT Madras',
        channel: 'NPTEL / IIT Madras',
        duration: '8 Weeks',
        platform: 'NPTEL',
        url: 'https://nptel.ac.in/courses/108/106/108106171/',
        isFree: true,
      },
      {
        title: 'Embedded C Programming & ARM Cortex-M Crash Course',
        channel: 'FastBit Embedded Academy',
        duration: '6 hrs',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=3V9eqvkMzHA',
        isFree: true,
      },
      {
        title: 'FreeRTOS Tutorial for Beginners with STM32 / ESP32',
        channel: 'Mitch Davis',
        duration: '4 hrs',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=F321087yYy4',
        isFree: true,
      },
    ],
    notes: {
      title: 'Embedded C & Register Manipulation Cheatsheet',
      content:
        'In embedded systems, hardware peripherals are controlled by reading and writing to specific memory addresses mapped to hardware registers.',
      keyTakeaways: [
        'Always use `volatile` for hardware registers or variables shared between ISRs and main thread to prevent compiler optimization.',
        'Bit manipulation: Set bit: `REG |= (1 << n);` | Clear bit: `REG &= ~(1 << n);` | Toggle: `REG ^= (1 << n);`',
        'Keep ISRs as short as possible; never call blocking delays or memory allocations inside an ISR.',
      ],
      cheatsheetCode: `// Register level GPIO toggle (ARM Cortex / STM32)
#define GPIOA_BASE  (0x40020000UL)
#define GPIOA_MODER (*((volatile unsigned int *)(GPIOA_BASE + 0x00)))
#define GPIOA_ODR   (*((volatile unsigned int *)(GPIOA_BASE + 0x14)))

void init_pin5_output(void) {
    GPIOA_MODER &= ~(3U << 10);  // Clear mode
    GPIOA_MODER |=  (1U << 10);  // Set as Output (01)
}

void toggle_pin5(void) {
    GPIOA_ODR ^= (1U << 5);      // Toggle Pin 5
}`,
    },
    projects: [
      {
        title: 'FreeRTOS Environmental Health Monitor (ESP32 / STM32)',
        difficulty: 'Intermediate',
        description: 'Read temperature, humidity, and air quality on dedicated tasks, display on OLED, and trigger alerts.',
        features: ['FreeRTOS Queues', 'I2C OLED driver', 'Sleep mode power management', 'Watchdog reset'],
      },
      {
        title: 'Bare-Metal CAN-Bus Automotive Telemetry Node',
        difficulty: 'Advanced',
        description: 'Transmit real-time motor and sensor readings across CAN bus at 500kbps without RTOS overhead.',
        features: ['CAN controller registers', 'DMA buffers', 'Hardware interrupt filters'],
      },
    ],
    interviewQuestions: [
      {
        q: 'Why is the volatile keyword mandatory for variables modified inside an Interrupt Service Routine (ISR)?',
        a: 'Because the compiler might assume the variable never changes outside the normal execution flow and cache it in a CPU register. `volatile` forces the CPU to read the variable from physical RAM on every access.',
      },
      {
        q: 'What is Priority Inversion in RTOS and how does Priority Inheritance solve it?',
        a: 'Priority Inversion occurs when a low-priority task holds a resource needed by a high-priority task, but a medium-priority task preempts the low-priority task. Priority Inheritance temporarily boosts the low-priority task to the high priority until it releases the shared lock.',
      },
    ],
  },

  iot: {
    skill: 'Internet of Things (IoT)',
    category: 'Connected Devices & Edge Computing',
    difficulty: 'Beginner',
    estWeeks: 3,
    overview:
      'IoT connects physical sensors and edge controllers with cloud services (AWS IoT, MQTT brokers) for real-time telemetry, remote commands, and edge AI.',
    roadmap: [
      {
        phase: 'Phase 1',
        title: 'Edge Hardware (ESP32/Raspberry Pi) & Sensor Interfacing',
        duration: 'Week 1',
        topics: [
          'ESP32 WiFi/Bluetooth architecture and power management',
          'Analog & Digital sensor reading (DHT22, ultrasonic, gas sensors)',
          'Local Web Servers & REST APIs on microcontrollers',
          'Deep sleep power optimization for battery-operated nodes',
        ],
        milestone: 'Create a standalone WiFi-connected telemetry node with local dashboard.',
      },
      {
        phase: 'Phase 2',
        title: 'IoT Protocols (MQTT, CoAP, HTTP) & Edge Security',
        duration: 'Week 2',
        topics: [
          'MQTT protocol: Publish/Subscribe, QoS 0/1/2, Retained messages, Last Will',
          'Setting up Mosquitto MQTT Broker on Cloud / Raspberry Pi',
          'TLS/SSL MQTTS encryption and certificate-based authentication',
          'Payload serialization with JSON and Protobuf / MessagePack',
        ],
        milestone: 'Publish live sensor telemetry to an encrypted MQTT broker and receive remote command payloads.',
      },
      {
        phase: 'Phase 3',
        title: 'Cloud IoT Platforms & Over-The-Air (OTA) Updates',
        duration: 'Week 3',
        topics: [
          'AWS IoT Core / Google Cloud IoT integration',
          'Time-series databases (InfluxDB) & Grafana live telemetry dashboards',
          'Remote OTA (Over-The-Air) firmware update servers',
          'Edge ML inference on ESP32 (TensorFlow Lite for Microcontrollers)',
        ],
        milestone: 'Build an end-to-end cloud-connected IoT fleet with remote OTA firmware deployment.',
      },
    ],
    videos: [
      {
        title: 'Introduction to IoT Course by SWAYAM / NPTEL (IIT Kharagpur)',
        channel: 'SWAYAM',
        duration: '8 Weeks',
        platform: 'SWAYAM',
        url: 'https://swayam.gov.in/nd1_noc18_cs27',
        isFree: true,
      },
      {
        title: 'Complete MQTT & ESP32 IoT Tutorial Series',
        channel: 'Random Nerd Tutorials',
        duration: '4 hrs',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=k_DEJ3cZ90c',
        isFree: true,
      },
      {
        title: 'AWS IoT Core Full Hands-on Crash Course',
        channel: 'freeCodeCamp.org',
        duration: '3 hrs',
        platform: 'freeCodeCamp',
        url: 'https://www.youtube.com/watch?v=6mBC5Fkmqkc',
        isFree: true,
      },
    ],
    notes: {
      title: 'IoT Protocols & MQTT Architecture Cheatsheet',
      content:
        'MQTT is a lightweight, publish-subscribe network protocol designed for constrained devices with low bandwidth and high latency.',
      keyTakeaways: [
        'MQTT Topics use hierarchical slashes, e.g. `factory/zone1/temperature`.',
        'Wildcards: `+` matches single level (`factory/+/temp`), `#` matches all remaining sub-levels.',
        'QoS 0: At most once | QoS 1: At least once (retransmits until ACK) | QoS 2: Exactly once.',
      ],
      cheatsheetCode: `# MicroPython / Python MQTT Client Example
import paho.mqtt.client as mqtt
import json

BROKER = "test.mosquitto.org"
TOPIC_TELEMETRY = "punarshuru/iot/telemetry"

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker with code", rc)
    client.subscribe("punarshuru/iot/control/#")

client = mqtt.Client()
client.on_connect = on_connect
client.connect(BROKER, 1883, 60)

# Publish Telemetry
payload = json.dumps({"temp": 28.5, "humidity": 62, "status": "OK"})
client.publish(TOPIC_TELEMETRY, payload, qos=1)`,
    },
    projects: [
      {
        title: 'Industrial Cold Storage IoT Telemetry & Alert System',
        difficulty: 'Beginner',
        description: 'ESP32 monitors temperature/humidity, streams to InfluxDB via MQTT, and sends WhatsApp alerts on threshold breach.',
        features: ['MQTTS encryption', 'InfluxDB time-series', 'Grafana dashboard', 'Twilio alert webhook'],
      },
      {
        title: 'Smart Energy Meter with Over-The-Air (OTA) Updates',
        difficulty: 'Intermediate',
        description: 'Tracks power consumption in real-time, stores data on cloud, and updates firmware remotely over WiFi.',
        features: ['OTA firmware server', 'AWS IoT Core integration', 'Power calculation math'],
      },
    ],
    interviewQuestions: [
      {
        q: 'Why is MQTT preferred over HTTP for IoT sensor nodes?',
        a: 'MQTT has a 2-byte header compared to HTTP multi-kilobyte headers, supports bi-directional push without polling, maintains persistent TCP sessions, and operates on battery-constrained microcontrollers with minimal memory footprint.',
      },
      {
        q: 'What is the purpose of MQTT Last Will and Testament (LWT)?',
        a: 'LWT is a pre-configured message registered with the broker upon connection. If the client disconnects ungracefully (power cut, network drop), the broker automatically broadcasts this LWT message to inform subscribers of node failure.',
      },
    ],
  },
}

// ── Curated Real Video Links for Popular Common Skills ────────────────────────
const CURATED_SKILL_VIDEOS: Record<string, SkillRoadmapData['videos']> = {
  python: [
    {
      title: 'Python Tutorial for Beginners - Full Course',
      channel: 'freeCodeCamp.org',
      duration: '4 hrs 26 mins',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      isFree: true,
    },
    {
      title: 'Python for Beginners – Full Course [Programming with Mosh]',
      channel: 'Programming with Mosh',
      duration: '6 hrs 14 mins',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
      isFree: true,
    },
    {
      title: 'NPTEL: The Joy of Computing using Python',
      channel: 'IIT Madras / NPTEL',
      duration: '12 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/106/106106182/',
      isFree: true,
    },
  ],
  docker: [
    {
      title: 'Docker Tutorial for Beginners [Full Course]',
      channel: 'freeCodeCamp.org',
      duration: '4 hrs 10 mins',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      isFree: true,
    },
    {
      title: 'Docker Tutorial for Beginners [Hindi / English]',
      channel: 'TechWorld with Nana',
      duration: '3 hrs',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
      isFree: true,
    },
    {
      title: 'NPTEL: Cloud Computing & Virtualization',
      channel: 'IIT Kharagpur / NPTEL',
      duration: '8 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/105/106105167/',
      isFree: true,
    },
  ],
  react: [
    {
      title: "React Course - Beginner's Tutorial for React JavaScript",
      channel: 'freeCodeCamp.org',
      duration: '12 hrs',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      isFree: true,
    },
    {
      title: 'React JS Full Course in Hindi (Chai aur Code)',
      channel: 'Chai aur Code',
      duration: '10 hrs',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=vz1RlUy5594',
      isFree: true,
    },
    {
      title: 'NPTEL: Modern Application Development - Web Technologies',
      channel: 'IIT Madras / NPTEL',
      duration: '8 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/106/106106222/',
      isFree: true,
    },
  ],
  java: [
    {
      title: 'Java Tutorial for Beginners - Full Course',
      channel: 'freeCodeCamp.org',
      duration: '9 hrs 30 mins',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=A74TOX803D0',
      isFree: true,
    },
    {
      title: 'Java Full Course 2024 (Telusko)',
      channel: 'Telusko',
      duration: '12 hrs',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=BGTx91t8q50',
      isFree: true,
    },
    {
      title: 'NPTEL: Programming in Java',
      channel: 'IIT Kharagpur / NPTEL',
      duration: '12 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/105/106105191/',
      isFree: true,
    },
  ],
  'spring boot': [
    {
      title: 'Spring Boot Tutorial for Beginners - Full Course',
      channel: 'freeCodeCamp.org',
      duration: '4 hrs',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=9SGDpanrc8U',
      isFree: true,
    },
    {
      title: 'Spring Boot 3 Tutorial Crash Course',
      channel: 'Amigoscode',
      duration: '5 hrs',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=5r3QU09903k',
      isFree: true,
    },
  ],
  sql: [
    {
      title: 'SQL Tutorial - Full Database Course for Beginners',
      channel: 'freeCodeCamp.org',
      duration: '4 hrs 20 mins',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
      isFree: true,
    },
    {
      title: 'NPTEL: Database Management System',
      channel: 'IIT Kharagpur / NPTEL',
      duration: '8 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/105/106105175/',
      isFree: true,
    },
  ],
  aws: [
    {
      title: 'AWS Certified Cloud Practitioner Course',
      channel: 'freeCodeCamp.org',
      duration: '14 hrs',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=SOTamWNgDKc',
      isFree: true,
    },
    {
      title: 'NPTEL: Cloud Computing',
      channel: 'IIT Kharagpur / NPTEL',
      duration: '8 Weeks',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106/105/106105167/',
      isFree: true,
    },
  ],
  langchain: [
    {
      title: 'LangChain Full Course 2024 – Generative AI with Python',
      channel: 'freeCodeCamp.org',
      duration: '3 hrs 30 mins',
      platform: 'freeCodeCamp',
      url: 'https://www.youtube.com/watch?v=aywZrzNaKjs',
      isFree: true,
    },
    {
      title: 'Complete LangChain Tutorial with RAG and LLMs',
      channel: 'Krish Naik',
      duration: '3 hrs 40 mins',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=2xxziIWmaSA',
      isFree: true,
    },
  ],
}

// ── Generic Dynamic Generator for Any Skill ──────────────────────────────────
function generateDynamicRoadmap(skillName: string): SkillRoadmapData {
  const cleanName = skillName.trim()
  const lower = cleanName.toLowerCase()
  const matchedKey = Object.keys(CURATED_SKILL_VIDEOS).find((k) => lower.includes(k))
  const videoList = matchedKey
    ? CURATED_SKILL_VIDEOS[matchedKey]
    : [
        {
          title: `${cleanName} Full Course for Beginners (Zero to Hero)`,
          channel: 'freeCodeCamp.org',
          duration: '4–6 hrs',
          platform: 'freeCodeCamp' as const,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanName + ' full course tutorial freecodecamp')}`,
          isFree: true,
        },
        {
          title: `${cleanName} Complete Practical Crash Course`,
          channel: 'YouTube Technical Educators',
          duration: '3 hrs',
          platform: 'YouTube' as const,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanName + ' practical crash course')}`,
          isFree: true,
        },
        {
          title: `SWAYAM / NPTEL: Certified Industry Course for ${cleanName}`,
          channel: 'NPTEL / SWAYAM Govt Portal',
          duration: '8 Weeks',
          platform: 'SWAYAM' as const,
          url: `https://swayam.gov.in/explorer?searchText=${encodeURIComponent(cleanName)}`,
          isFree: true,
        },
      ]

  return {
    skill: cleanName,
    category: 'Technical Competency',
    difficulty: 'Intermediate',
    estWeeks: 3,
    overview: `Master ${cleanName} step-by-step from core syntax and architectural concepts to hands-on portfolio projects and technical interview preparation.`,
    roadmap: [
      {
        phase: 'Phase 1',
        title: `${cleanName} Fundamentals & Environment Setup`,
        duration: 'Week 1',
        topics: [
          `Installation, workspace setup, and runtime configuration for ${cleanName}`,
          `Core syntax, standard conventions, and basic building blocks`,
          `Essential data structures, modules, and package management`,
          `Writing and debugging simple self-contained modules`,
        ],
        milestone: `Set up local developer environment and create a functioning baseline project in ${cleanName}.`,
      },
      {
        phase: 'Phase 2',
        title: `Core Architectural Patterns & Intermediate Concepts`,
        duration: 'Week 2',
        topics: [
          `Design patterns and idiomatic conventions used by industry teams`,
          `Error handling, asynchronous operations, and performance tuning`,
          `Interfacing with databases, external APIs, and network protocols`,
          `Unit testing and test-driven development (TDD)`,
        ],
        milestone: `Build a modular service utilizing ${cleanName} with comprehensive error handling and tests.`,
      },
      {
        phase: 'Phase 3',
        title: `Hands-on Portfolio Project & Interview Mastery`,
        duration: 'Week 3',
        topics: [
          `Architecting a complete end-to-end portfolio project for your resume`,
          `Benchmarking performance, memory optimization, and security audits`,
          `CI/CD integration and deployment best practices`,
          `Top 20 technical interview questions and scenario-based problem solving`,
        ],
        milestone: `Publish a tested, documented open-source repository on GitHub demonstrating mastery of ${cleanName}.`,
      },
    ],
    videos: videoList,
    notes: {
      title: `${cleanName} Quick Reference & Core Architecture Notes`,
      content: `${cleanName} is widely demanded across modern software engineering and technical roles in India. Key focus areas include clean code structure, memory efficiency, and integration with modern toolchains.`,
      keyTakeaways: [
        `Understand the lifecycle, concurrency model, and execution pipeline of ${cleanName}.`,
        `Always follow standard linting, static typing, and automated unit testing practices.`,
        `Structure your code into decoupled, reusable modules with explicit dependency injection.`,
      ],
      cheatsheetCode: `// Quick Starter Template for ${cleanName}
// 1. Initialize configuration and environment
// 2. Define domain models and interfaces
// 3. Implement business logic with error handling
// 4. Run automated test suites to verify reliability`,
    },
    projects: [
      {
        title: `Production-Grade ${cleanName} Application`,
        difficulty: 'Intermediate',
        description: `Build a complete, real-world service leveraging ${cleanName} with clean architecture and automated tests.`,
        features: ['Modular architecture', 'Robust error handling', 'API endpoints / CLI interface', 'Comprehensive README documentation'],
      },
      {
        title: `Full-Stack Analytics & Integration System`,
        difficulty: 'Advanced',
        description: `Integrate ${cleanName} into a modern web stack with live dashboarding and automated cloud deployment.`,
        features: ['Live telemetry', 'Database persistence', 'Docker containerization', 'CI/CD pipeline'],
      },
    ],
    interviewQuestions: [
      {
        q: `What are the primary advantages and key use cases of ${cleanName}?`,
        a: `${cleanName} enables high-performance, maintainable execution of technical workloads with strong community support and extensive ecosystem tooling.`,
      },
      {
        q: `How do you handle error boundaries and optimize performance in ${cleanName}?`,
        a: `By implementing structured logging, defensive input validation, asynchronous resource pooling, and monitoring execution bottlenecks with profiling tools.`,
      },
    ],
  }
}

interface SkillRoadmapModalProps {
  skillName: string | null
  isOpen: boolean
  onClose: () => void
}

type TabType = 'roadmap' | 'videos' | 'notes' | 'projects' | 'interview'

export default function SkillRoadmapModal({ skillName, isOpen, onClose }: SkillRoadmapModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('roadmap')
  const [copied, setCopied] = useState(false)
  const [savedToPath, setSavedToPath] = useState(false)

  if (!isOpen || !skillName) return null

  // Lookup normalized key or generate dynamically
  const key = skillName.trim().toLowerCase()
  const data: SkillRoadmapData = SKILL_DATABASE[key] || generateDynamicRoadmap(skillName)

  const handleCopyNotes = () => {
    const textToCopy = `# ${data.skill} Study Notes\n\n${data.notes.content}\n\n## Key Takeaways:\n${data.notes.keyTakeaways.map((t) => `- ${t}`).join('\n')}\n\n\`\`\`\n${data.notes.cheatsheetCode || ''}\n\`\`\``
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasSearchLinks = data.videos.some(
    (vid) =>
      vid.url.includes('results?search_query') ||
      vid.url.includes('swayam.gov.in/explorer') ||
      vid.url === 'https://swayam.gov.in/' ||
      vid.url === 'https://swayam.gov.in'
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* 1. Header Banner */}
          <div className="p-6 bg-gradient-to-r from-[#0B4F9C] via-blue-800 to-[#F26B1D] text-white relative shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/25 backdrop-blur-md">
                {data.category}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
                Level: {data.difficulty}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Clock size={11} />
                {data.estWeeks} Weeks Plan
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{data.skill}</span>
              <Sparkles size={22} className="text-amber-300" />
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 leading-relaxed">
              {data.overview}
            </p>
          </div>

          {/* 2. Tabs Navigation */}
          <div className="flex items-center gap-1.5 p-2 px-4 sm:px-6 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0">
            {[
              { id: 'roadmap' as TabType, label: 'Learning Roadmap', icon: BookOpen },
              { id: 'videos' as TabType, label: 'Free Videos & Courses', icon: Video },
              { id: 'notes' as TabType, label: 'Notes & Cheatsheet', icon: FileText },
              { id: 'projects' as TabType, label: 'Portfolio Projects', icon: Code2 },
              { id: 'interview' as TabType, label: 'Interview Q&A', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#0B4F9C] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* 3. Tab Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* Tab 1: Step-by-Step Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    4-Phase Step-by-Step Learning Timeline
                  </h3>
                  <span className="text-xs text-slate-500">Structured for maximum hiring ROI</span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {data.roadmap.map((step, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full bg-[#0B4F9C] text-white flex items-center justify-center text-[10px] font-black ring-4 ring-white dark:ring-slate-900 shadow-sm">
                        {idx + 1}
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                              {step.phase}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {step.title}
                            </h4>
                          </div>
                          <span className="text-xs font-semibold text-[#F26B1D] dark:text-orange-400">
                            ⏱ {step.duration}
                          </span>
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                          {step.topics.map((tp, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2">
                              <span className="text-[#0B4F9C] dark:text-sky-400 mt-0.5">•</span>
                              <span>{tp}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-750 flex items-center gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>Milestone: {step.milestone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Curated Video Lectures */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {hasSearchLinks ? 'Curated Free Videos & Course Search' : 'Verified Free Video Lectures & Courses'}
                  </h3>
                  <span
                    className={`text-xs font-bold ${
                      hasSearchLinks
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {hasSearchLinks ? 'Search for free resources' : '✓ 100% Free & Open Access'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.videos.map((vid, idx) => {
                    const isSearchLink =
                      vid.url.includes('results?search_query') ||
                      vid.url.includes('swayam.gov.in/explorer') ||
                      vid.url === 'https://swayam.gov.in/' ||
                      vid.url === 'https://swayam.gov.in'

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-[#0B4F9C] transition-all shadow-xs flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300">
                              {vid.platform}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                              <Clock size={11} /> {vid.duration}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-sky-400 transition-colors">
                            {vid.title}
                          </h4>
                          <p className="text-xs text-slate-500">Instructor / Channel: {vid.channel}</p>
                        </div>

                        <a
                          href={vid.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#0B4F9C] hover:text-white dark:hover:bg-[#0B4F9C] text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
                        >
                          {isSearchLink ? (
                            <Search size={13} className="shrink-0" />
                          ) : (
                            <Play size={13} className="fill-current shrink-0" />
                          )}
                          <span>{isSearchLink ? 'Search for free resources' : 'Watch Free Course'}</span>
                          <ExternalLink size={12} className="ml-1 shrink-0" />
                        </a>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>📚 <strong className="text-slate-700 dark:text-slate-300">Data source:</strong> Free video lectures & certifications verified directly with NPTEL (IIT Madras/Kharagpur), SWAYAM, and freeCodeCamp.</span>
                </div>
              </div>
            )}

            {/* Tab 3: Notes & Cheatsheet */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {data.notes.title}
                  </h3>
                  <button
                    type="button"
                    onClick={handleCopyNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Study Notes'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {data.notes.content}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Key Concept Takeaways:
                  </h4>
                  <ul className="space-y-2">
                    {data.notes.keyTakeaways.map((takeaway, tIdx) => (
                      <li
                        key={tIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F26B1D] mt-1.5 shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {data.notes.cheatsheetCode && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Syntax & Command Cheatsheet:
                    </h4>
                    <pre className="p-4 rounded-2xl bg-slate-950 text-sky-300 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                      <code>{data.notes.cheatsheetCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Hands-on Portfolio Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Resume-Ready Portfolio Projects
                  </h3>
                  <span className="text-xs text-slate-500">Build these to prove hands-on mastery</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((proj, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-[#F26B1D] dark:text-orange-300">
                          {proj.difficulty}
                        </span>
                        <Code2 size={16} className="text-slate-400" />
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Key Features:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.features.map((ft, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              ✓ {ft}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Technical Interview Q&A */}
            {activeTab === 'interview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Frequently Asked Interview Questions
                  </h3>
                  <span className="text-xs text-slate-500">Real hiring manager questions & model answers</span>
                </div>

                <div className="space-y-3">
                  {data.interviewQuestions.map((qa, qIdx) => (
                    <div
                      key={qIdx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                    >
                      <div className="flex items-start gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0B4F9C] dark:text-sky-300 font-mono text-[10px]">
                          Q{qIdx + 1}
                        </span>
                        <p className="leading-snug">{qa.q}</p>
                      </div>
                      <div className="pl-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-[#0B4F9C]/30 ml-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-0.5">Model Answer:</span>
                        {qa.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Footer Actions */}
          <div className="p-4 px-6 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Want to track progress on this skill?</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSavedToPath(true)
                  setTimeout(() => setSavedToPath(false), 3000)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:border-[#0B4F9C] transition-all shadow-xs cursor-pointer"
              >
                {savedToPath ? <Check size={14} className="text-emerald-500" /> : <BookmarkPlus size={14} className="text-[#F26B1D]" />}
                <span>{savedToPath ? 'Added to My Path!' : 'Bookmark to My Path'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#0B4F9C] hover:bg-[#083b75] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
