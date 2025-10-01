import * as tf from '@tensorflow/tfjs-node'
import { load } from '@tensorflow-models/universal-sentence-encoder'

const model = await load()

export async function embedText(text: string) {
  const embedding = await model.embed(text)
  return embedding.array()
}

export function similarity(embedding1: number[], embedding2: number[]) {
  const tensor1 = tf.tensor1d(embedding1)
  const tensor2 = tf.tensor1d(embedding2)

  const dotProduct = tf.sum(tf.mul(tensor1, tensor2))

  const magnitude1 = tf.sqrt(tf.sum(tf.square(tensor1)))
  const magnitude2 = tf.sqrt(tf.sum(tf.square(tensor2)))

  const similarity = tf.div(dotProduct, tf.mul(magnitude1, magnitude2))

  const result = similarity.dataSync()[0]

  tensor1.dispose()
  tensor2.dispose()
  dotProduct.dispose()
  magnitude1.dispose()
  magnitude2.dispose()
  similarity.dispose()

  return result
}
