import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';

import Exam from './exam.model';
import Teacher from '../teacher/teacher.model';
import examsService from './exam.service';
import catchErrors from '../../common/catchErrors';

const router = Router({ mergeParams: true });


router.route('/').get(
  catchErrors(async (_req: Request, res: Response) => {
    const exams = await examsService.getAll();

    res.json(exams.map(Exam.toResponse));
  })
);

router.route('/').post(
  catchErrors(async (req: Request, res: Response) => {
    const { studentId, teacherId, date, score } = req.body;

    const exam = await examsService.createExam({ studentId, teacherId, date, score });

    if (exam) {
      res.status(StatusCodes.CREATED).json(Exam.toResponse(exam));
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ code: 'BAD_REQUEST', msg: 'Bad request' });
    }
  })
);

router.route('/:id').get(
  catchErrors(async (req: Request, res: Response) => {
    const { id } = req.params;

    const exam = await examsService.getById(id || '');

    if (exam) {
      res.json(Exam.toResponse(exam));
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ code: 'EXAM_NOT_CREATE', msg: 'Exam not found' });
    }
  })
);

router.route('/:id').put(
  catchErrors(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { studentId, teacherId, date, score } = req.body;

    const exam = await examsService.updateById({ id: id || '', studentId, teacherId, date, score });

    if (exam) {
      res.status(StatusCodes.OK).json(Exam.toResponse(exam));
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ code: 'EXAM_NOT_FOUND', msg: 'Exam not found' });
    }
  })
);

router.route('/:id').delete(
  catchErrors(async (req: Request, res: Response) => {
    const { id } = req.params;

    const exam = await examsService.deleteById(id || '');

    if (!exam) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ code: 'EXAM_NOT_FOUND', msg: 'Exam not found' });
    }

    return res
      .status(StatusCodes.NO_CONTENT)
      .json({ code: 'EXAM_DELETED', msg: 'The exam has been deleted' });
  })
);

router.route('/:examId/teachers').get(
  catchErrors(async (req: Request, res: Response) => {
    const { examId } = req.params;

    const teachers = await examsService.getTeachersByExamId(examId || '');

    if (teachers) {
      res.json(Teacher.toResponse(teachers));
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ code: 'EXAM_NOT_CREATE', msg: 'Exam not found' });
    }
  })
);

export default router;