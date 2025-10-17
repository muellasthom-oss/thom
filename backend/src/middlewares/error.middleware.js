export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' })
}

export const errorHandler = (error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal Server Error' })
}
