import { Router } from "express";
import { runAgent } from "../agent/agent.js";


const router = Router();


router.post(
  "/chat",
  async (req, res) => {

    try {

      const result =
        await runAgent(req.body);


      res.json({
        success:true,
        ...result,
      });


    } catch(error){

  console.error(
    "AGENT ERROR:",
    error
  );

  res.status(500).json({
    success:false,
    message:
      error instanceof Error
        ? error.message
        : "Agent failed",
  });

}

  }
);


export default router;