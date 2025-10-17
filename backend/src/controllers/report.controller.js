import { z } from 'zod'
import { getSalesReport, getFinanceReport } from '../services/report.service.js'

export const salesReport = (req, res) => {
  const schema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
  try {
    const payload = schema.parse(req.query)
    const report = getSalesReport(payload)
    res.json(report)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const financeReport = (req, res) => {
  const report = getFinanceReport()
  res.json(report)
}
