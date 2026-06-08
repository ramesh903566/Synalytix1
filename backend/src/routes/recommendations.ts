import { Router, Request, Response } from "express";
import { recommendationService } from "../services/recommendationService";
import { authenticate } from "../middleware/auth";
import { GenerateInputSchema } from "../types/recommendations";

const router = Router();
router.use(authenticate);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const orgId = "default_org"; // Assuming no org_id in req
    const data = await recommendationService.fetchExisting(userId, orgId);
    if (!data) {
      return res.status(404).json({ success: false, error: "No recommendations found" });
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const orgId = "default_org";
    const parsed = GenerateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues });
    }
    const data = await recommendationService.generate(userId, orgId, parsed.data);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/complete", async (req: Request, res: Response) => {
  try {
    await recommendationService.markComplete(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/:id/dismiss", async (req: Request, res: Response) => {
  try {
    await recommendationService.dismiss(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/alerts/:id/dismiss", async (req: Request, res: Response) => {
  try {
    await recommendationService.dismissAlert(req.params.id, req.userId!);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
