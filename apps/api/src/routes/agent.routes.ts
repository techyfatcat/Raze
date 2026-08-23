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

      res.status(500).json({
        success:false,
        message:"Agent failed",
      });

    }

  }
);


export default router;