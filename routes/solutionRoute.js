import express from 'express';
import { createSolution, 
    deleteSolution, 
    getAllSolution, 
    getSolutionById,
    updateSolution
} from '../controllers/solutionController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route("/")
    .post(isAdminAuthenticated, createSolution)
    .get(getAllSolution);

router.route("/:id")
    .get(getSolutionById)
    .put(isAdminAuthenticated, updateSolution)
    

router.delete('/delete/:id',isAdminAuthenticated, deleteSolution);


export default router;
