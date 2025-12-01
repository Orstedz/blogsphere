import { BaseController } from "./baseController.js";

const controller = new BaseController("Roles", "Role");

export async function getRoles(req, res) {
  return controller.getAll(req, res);
}

export async function createRole(req, res) {
  const { name, description } = req.validated;
  return controller.create(req, res, { name, description });
}

export async function updateRole(req, res) {
  const { name, description } = req.validated;
  return controller.update(req, res, { name, description });
}

export async function deleteRole(req, res) {
  return controller.delete(req, res);
}

export async function getRoleById(req, res) {
  return controller.getById(req, res);
}
