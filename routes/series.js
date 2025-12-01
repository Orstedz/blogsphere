import express from "express";
import {
  getSeries,
  createSeries,
  updateSeries,
  deleteSeries,
} from "../controllers/seriesController.js";
import { validate, validationSchemas } from "../middleware/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Get all series
 *     tags: [Series]
 *     responses:
 *       200:
 *         description: List of series
 *   post:
 *     summary: Create a new series
 *     tags: [Series]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Series created
 * /api/series/{id}:
 *   put:
 *     summary: Update a series
 *     tags: [Series]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Series updated
 *   delete:
 *     summary: Delete a series
 *     tags: [Series]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Series deleted
 */
router.get("/", getSeries);
router.post("/", validate(validationSchemas.series.create), createSeries);
router.put("/:id", validate(validationSchemas.series.update), updateSeries);
router.delete("/:id", deleteSeries);

export default router;
