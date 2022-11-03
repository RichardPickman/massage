import { $authHost, $host } from "./index";

export const create = async (questions, title) => {
  const { data } = await $host.post('api/quiz/create', { questions, title })

  return data;
}

export const update = async (id, questions, title) => {
  const { data } = await $host.post('api/quiz/update/:id', { id, questions, title })

  return data;
}

export const get = async (id) => {
  const { data } = await $host.post('api/quiz/:id', { id })

  return data;
}

export const getAll = async () => {
  const { data } = await $host.post('api/quiz/all');

  return data;
}

export const remove = async () => {
  const { data } = await $authHost.get('api/quiz/remove/' )

  return data;
}
