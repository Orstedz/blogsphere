/**
 * Base controller with common CRUD operations for MongoDB
 * Reduces code duplication across all controllers
 */
export class BaseController {
  constructor(Model, resourceName) {
    this.Model = Model;
    this.resourceName = resourceName;
  }

  /**
   * Get all records
   */
  async getAll(req, res) {
    try {
      const data = await this.Model.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error fetching ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Create a new record
   */
  async create(req, res, fields) {
    try {
      const newDoc = new this.Model(fields);
      await newDoc.save();

      res.status(201).json({
        success: true,
        message: `${this.resourceName} created successfully`,
        data: newDoc,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: `${this.resourceName} already exists`,
        });
      }
      res.status(500).json({
        success: false,
        message: `Error creating ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Update a record by ID
   */
  async update(req, res, fields) {
    try {
      const { id } = req.params;

      const updatedDoc = await this.Model.findByIdAndUpdate(
        id,
        { $set: fields },
        { new: true, runValidators: true }
      );

      if (!updatedDoc) {
        return res.status(404).json({
          success: false,
          message: `${this.resourceName} not found`,
        });
      }

      res.json({
        success: true,
        message: `${this.resourceName} updated successfully`,
        data: updatedDoc,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error updating ${this.resourceName}`,
        error: err.message,
      });
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedDoc = await this.Model.findByIdAndDelete(id);

      if (!deletedDoc) {
        return res.status(404).json({
          success: false,
          message: `${this.resourceName} not found`,
        });
      }

      res.json({
        success: true,
        message: `${this.resourceName} deleted successfully`,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error deleting ${this.resourceName}`,
        error: err.message,
      });
    }
  }
}
