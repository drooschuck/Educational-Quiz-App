import { createApp, ref, reactive, computed } from 'vue';

const YearSelection = {
  template: `
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Select Your Year Group</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <button v-for="year in years" :key="year" @click="$emit('year-selected', year)"
          class="year-group-button subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          Year {{ year }}
        </button>
      </div>
    </div>
  `,
  props: ['years']
};

const SubjectSelection = {
  template: `
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Select a Subject</h2>
      <h3 class="text-xl font-medium text-blue-700 mt-6 mb-3">Science Subjects</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button v-for="subject in scienceSubjects" :key="subject" @click="$emit('subject-selected', subject)"
          class="subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span v-if="subject === 'Physics'">⚛️</span>
              <span v-else-if="subject === 'Chemistry'">🧪</span>
              <span v-else-if="subject === 'Biology'">🧬</span>
            </div>
            <span>{{ subject }}</span>
          </div>
        </button>
      </div>
      <h3 class="text-xl font-medium text-blue-700 mt-6 mb-3">Other Subjects</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button v-for="subject in otherSubjects" :key="subject" @click="$emit('subject-selected', subject)"
          class="subject-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          {{ subject }}
        </button>
      </div>
    </div>
  `,
  props: ['availableSubjects'],
  computed: {
    scienceSubjects() {
      return ['Physics', 'Chemistry', 'Biology'];
    },
    otherSubjects() {
      return this.availableSubjects.filter(s => !this.scienceSubjects.includes(s));
    }
  }
};

const UnitSelection = {
  template: `
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ currentSubject }} - Year {{ selectedYear }}</h2>
      <h3 class="text-xl font-medium text-blue-700 mb-3">Select a Unit</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button v-for="unit in availableUnits" :key="unit" @click="$emit('unit-selected', unit)"
          class="unit-card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          Unit {{ unit }}
        </button>
      </div>
      <button @click="$emit('back-to-subjects')" class="bg-gray-500 text-white p-2 rounded-lg">Back to Subjects</button>
    </div>
  `,
  props: ['currentSubject', 'selectedYear', 'availableUnits']
};

const Quiz = {
  template: `
    <div>
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">{{ quizTitle }}</h2>
          <span class="text-lg">Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</span>
        </div>
        <div class="mb-2">
          <span class="text-sm text-blue-600">{{ currentQuestion.topic }}</span>
        </div>
        <div class="question-container mb-4">
          <p class="text-lg font-medium">{{ currentQuestion.question }}</p>
          <div class="options mt-4">
            <button v-for="(option, index) in currentQuestion.options" :key="index" @click="selectAnswer(option)"
              :class="['option p-2 border rounded-lg mb-2 w-full', optionClass(option)]">
              {{ option }}
            </button>
          </div>
        </div>
        <button @click="nextQuestion" class="bg-blue-600 text-white p-2 rounded-lg" :disabled="!answerSelected">Next Question</button>
      </div>
    </div>
  `,
  props: ['quizTitle', 'questions', 'currentQuestionIndex', 'totalQuestions'],
  emits: ['answer-selected', 'next-question'],
  data() {
    return {
      selectedAnswer: null
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
    answerSelected() {
      return this.selectedAnswer !== null;
    }
  },
  methods: {
    selectAnswer(option) {
      if (this.selectedAnswer !== null) return; // prevent multiple selections
      this.selectedAnswer = option;
      this.$emit('answer-selected', option);
    },
    nextQuestion() {
      this.selectedAnswer = null;
      this.$emit('next-question');
    },
    optionClass(option) {
      if (this.selectedAnswer === null) return '';
      if (option === this.currentQuestion.answer) return 'correct';
      if (option === this.selectedAnswer && option !== this.currentQuestion.answer) return 'incorrect';
      return '';
    }
  }
};

const Results = {
  template: `
    <div class="text-center">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your Results</h2>
      <div class="mb-6">
        <p class="text-xl mb-2">Score: {{ score }} / {{ totalQuestions }}</p>
        <p class="text-lg">{{ resultMessage }}</p>
      </div>
      <div class="flex justify-center space-x-4">
        <button @click="$emit('retry-quiz')" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Retry Quiz</button>
        <button @click="$emit('choose-another-subject')" class="bg-gray-600 text-white px-4 py-2 rounded-lg">Choose Another Subject</button>
      </div>
    </div>
  `,
  props: ['score', 'totalQuestions'],
  computed: {
    resultMessage() {
      const percentage = (this.score / this.totalQuestions) * 100;
      if (percentage >= 80) return 'Excellent work!';
      if (percentage >= 60) return 'Good job!';
      if (percentage >= 40) return 'Not bad!';
      return 'Keep practicing!';
    }
  }
};

const App = {
  components: { YearSelection, SubjectSelection, UnitSelection, Quiz, Results },
  template: `
    <div>
      <div v-if="loading" id="loading-screen" class="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 text-lg font-medium text-gray-700">Loading Quiz App...</p>
        </div>
      </div>

      <div v-if="screen === 'home'" id="home-screen" class="container mx-auto px-4 py-8">
        <header class="text-center mb-12">
          <h1 class="text-4xl font-bold text-blue-800 mb-2">KS3 Quiz Master</h1>
          <p class="text-lg text-gray-600">Test your knowledge across all KS3 subjects</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div class="progress-bar bg-blue-600 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
          </div>
        </header>
        <YearSelection :years="years" @year-selected="selectYear" />
      </div>

      <div v-if="screen === 'subject'" id="subject-screen" class="container mx-auto px-4 py-8">
        <SubjectSelection :availableSubjects="availableSubjects" @subject-selected="selectSubject" />
      </div>

      <div v-if="screen === 'unit'" id="unit-screen" class="container mx-auto px-4 py-8">
        <UnitSelection :currentSubject="currentSubject" :selectedYear="selectedYear" :availableUnits="availableUnits" @unit-selected="selectUnit" @back-to-subjects="returnToSubjects" />
      </div>

      <div v-if="screen === 'quiz'" id="quiz-screen" class="container mx-auto px-4 py-8">
        <Quiz :quizTitle="quizTitle" :questions="questions" :currentQuestionIndex="currentQuestionIndex" :totalQuestions="totalQuestions" @answer-selected="selectAnswer" @next-question="nextQuestion" />
      </div>

      <div v-if="screen === 'results'" id="results-screen" class="container mx-auto px-4 py-8">
        <Results :score="score" :totalQuestions="totalQuestions" @retry-quiz="restartQuiz" @choose-another-subject="returnToSubjects" />
      </div>
    </div>
  `,
  setup() {
    const loading = ref(true);
    const screen = ref('home');
    const years = [7, 8, 9, 10, 11];
    const availableSubjects = ['Math', 'English', 'History', 'Physics', 'Chemistry', 'Biology'];
    const availableUnits = [1, 2, 3, 4];
    const selectedYear = ref(null);
    const currentSubject = ref('');
    const currentUnit = ref(null);
    const quizTitle = ref('');
    const questions = reactive([]);
    const currentQuestionIndex = ref(0);
    const totalQuestions = ref(0);
    const score = ref(0);

    const progress = computed(() => {
      if (totalQuestions.value === 0) return 0;
      return ((currentQuestionIndex.value) / totalQuestions.value) * 100;
    });

    function selectYear(year) {
      selectedYear.value = year;
      screen.value = 'subject';
    }

    function selectSubject(subject) {
      currentSubject.value = subject;
      screen.value = 'unit';
    }

    async function selectUnit(unit) {
      currentUnit.value = unit;
      const importPath = `./data/year${selectedYear.value}/${currentSubject.value.toLowerCase()}/unit${unit}.js`;
      console.log('Importing questions from:', importPath);
      try {
        const module = await import(importPath);
        quizTitle.value = module.quizSubject;
        questions.splice(0, questions.length, ...module.questions);
        totalQuestions.value = questions.length;
        score.value = 0;
        currentQuestionIndex.value = 0;
        screen.value = 'quiz';
      } catch (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load questions. Please try again.');
        screen.value = 'unit';
      }
    }

    function selectAnswer(option) {
      const currentQuestion = questions[currentQuestionIndex.value];
      if (!currentQuestion) return;
      if (option === currentQuestion.answer) {
        score.value++;
      }
      currentQuestionIndex.value++;
      if (currentQuestionIndex.value >= totalQuestions.value) {
        screen.value = 'results';
      }
    }

    function nextQuestion() {
      if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++;
      } else {
        screen.value = 'results';
      }
    }

    function restartQuiz() {
      currentQuestionIndex.value = 0;
      score.value = 0;
      screen.value = 'quiz';
    }

    function returnToSubjects() {
      screen.value = 'subject';
    }

    return {
      loading,
      screen,
      years,
      availableSubjects,
      availableUnits,
      selectedYear,
      currentSubject,
      currentUnit,
      quizTitle,
      questions,
      currentQuestionIndex,
      totalQuestions,
      score,
      progress,
      selectYear,
      selectSubject,
      selectUnit,
      selectAnswer,
      nextQuestion,
      restartQuiz,
      returnToSubjects
    };
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }
};

createApp(App).mount('#app');
