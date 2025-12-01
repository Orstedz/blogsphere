import { BaseController } from "./baseController.js";

const controller = new BaseController("Series", "Series");

export async function getSeries(req, res) {
  return controller.getAll(req, res);
}

export async function createSeries(req, res) {
  const { name, description, status } = req.validated;
  return controller.create(req, res, {
    name,
    description,
    status: status || "Active",
  });
}

export async function updateSeries(req, res) {
  const { name, description, status } = req.validated;
  return controller.update(req, res, { name, description, status });
}

export async function deleteSeries(req, res) {
  return controller.delete(req, res);
}

export async function getSeriesById(req, res) {
  return controller.getById(req, res);
}
