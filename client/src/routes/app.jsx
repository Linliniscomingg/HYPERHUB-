import Account from "../pages/Account";
import NotFound from "../pages/NotFound";
import QuizDetail from "../pages/QuizDetail";
import QuizLesson from "../pages/QuizLesson";
import QuizResult from "../pages/QuizResult";
import ReviewQuiz from "../pages/ReviewQuiz";

const Routes = [
  {
    path: "/home/user_credentials",
    view: Account,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - Account | E-Learning",
  },
  {
    path: "/home/quiz/:id",
    view: QuizLesson,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/quiz_result",
    view: QuizResult,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/home/reviewquiz/:id",
    view: ReviewQuiz,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  },
  {
    path: "/notfound",
    view: NotFound,
    layout: "app",
    // permission: 'student',
    title: "FunCourse - 404 Not Found | E-Learning",
  },
  {
    path: "/home/quiz_detail/:id",
    view: QuizDetail,
    layout: "lesson",
    // permission: 'student',
    title: "FunCourse - Lesson | E-Learning",
  }
];

export default Routes;