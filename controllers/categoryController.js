import { BaseController } from "./baseController.js";
import Category from "../models/Category.js";

const controller = new BaseController(Category, "Category");

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
