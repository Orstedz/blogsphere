import { BaseController } from "./baseController.js";

const controller = new BaseController("Series", "Series");

export async function getSeries(req, res) {
  return controller.getAll(req, res);
}

export async function createSeries(req, res) {
  const { name, description } = req.validated;
  return controller.create(req, res, { name, description });
}

export async function updateSeries(req, res) {
  const { name, description } = req.validated;
  return controller.update(req, res, { name, description });
}

export async function deleteSeries(req, res) {
  return controller.delete(req, res);
}

export async function getSeriesById(req, res) {
  return controller.getById(req, res);
}
