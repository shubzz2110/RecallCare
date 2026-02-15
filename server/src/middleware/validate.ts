import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type ValidationSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

const validate = (schema: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.params) {
        await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        await schema.query.parseAsync(req.query);
      }
      next();
    } catch (err: any) {
      console.log("Validation Error: ", err);
      return res.status(400).json({
        success: false,
        errors: err,
      });
    }
  };
};

export default validate;
