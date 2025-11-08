import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/ auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
const prisma = new PrismaClient();

//teacher profile yaratish

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Teacher profillari bilan ishlash
 */

/**
 * @swagger
 * /api/teachers/teacher:
 *   post:
 *     summary: Teacher profile yaratish
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               bio:
 *                 type: string
 *               experience:
 *                 type: integer
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *               telegram:
 *                 type: string
 *               instagram:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Teacher profile yaratildi
 *       400:
 *         description: Teacher profile yaratilmadi
 */

router.post('/teacher', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Faqat teacherlar uchun!' });
  }
  const { name, subject, bio, experience, achievements, telegram, instagram } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const teacherProfile = await prisma.teacher.create({
      data: {
        userId: req.user.id,
        name,
        subject,
        bio,
        image,
        experience,
        achievements,
        telegram,
        instagram,
      },
    });
    res.status(201).json(teacherProfile);
  } catch (error) {
    res.status(400).json({ message: 'Teacher profile yaratilmadi', error: error.message });
  }
});

/*teacher edit profile */
/**
 * @swagger
 * /api/teachers/teacher/{id}:
 *   put:
 *     summary: Teacher profile yangilash
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subject:
 *                 type: string
 *               bio:
 *                 type: string
 *               experience:
 *                 type: integer
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *               telegram:
 *                 type: string
 *               instagram:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Teacher profile yangilandi
 *       400:
 *         description: Teacher profile yangilanmadi
 */

router.put('/teacher/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, subject, bio, experience, achievement,telegram,instagram } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const updatedTeacher = await prisma.teacher.update({
      where: { id: parseInt(id) },
      data: {
        name,
        subject,
        bio,
        image,
        experience,
        achievements,
        telegram,
        instagram
      },
    });
    res.status(201).json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: 'teacher profile yangilanmadı', error: err.message });
  }
});

/* teacher list */
/**
 * @swagger
 * /api/teachers/teachers:
 *   get:
 *     summary: Teacherlar ro'yxati
 *     tags: [Teachers]
 *     responses:
 *       201:
 *         description: Teacherlar ro'yxati olindi
 *       400:
 *         description: Teacherlar ro'yxati olinmadi
 */

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { user: true, likes: true },
      orderBy: { likes: { _count: 'desc' } },
    });
    res.status(201).json(teachers);
  } catch (error) {
    res.status(400).json({ message: "teacherlar ro'yxati olinmadi" });
  }
});

//like bosish

/**
 * @swagger
 * /api/teachers/like/{teacherId}:
 *   post:
 *     summary: Teacherga like bosish
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Like bosildi
 *       400:
 *         description: Like bosilmadi yoki xatolik yuz berdi
 */
router.post('/like/:teacherId', authMiddleware, async (req, res) => {
  const { teacherId } = req.params;
  try {
    const like = await prisma.like.create({
      data: {
        userId: req.user.id,
        teacherId: parseInt(teacherId),
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Siz allaqachon like bosgansiz yoki xatolik yuz berdi' });
  }
});

export default router;
