import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export const nvidia = createOpenAICompatible({
  name: 'nvidia',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
})

export const NVIDIA_CHAT_MODEL = 'meta/llama-3.3-70b-instruct'
