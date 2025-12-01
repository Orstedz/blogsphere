import { BaseController } from "./baseController.js";

const controller = new BaseController("Categories", "Category");

export async function getCategories(req, res) {
  return controller.getAll(req, res);
}

export async function createCategory(req, res) {
  const { name, description } = req.validated;
  return controller.create(req, res, { name, description });
}

export async function updateCategory(req, res) {
  const { name, description } = req.validated;
  return controller.update(req, res, { name, description });
}

export async function deleteCategory(req, res) {
  return controller.delete(req, res);
}

export async function getCategoryById(req, res) {
  return controller.getById(req, res);
}
