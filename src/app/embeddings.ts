import '@tensorflow/tfjs-node'
import { load } from '@tensorflow-models/universal-sentence-encoder'

const model = await load()

export async function embedText(text: string) {
  const embedding = await model.embed(text)
  return embedding.array()
}
