import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {QuestionService} from "../services/question.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    HttpClientModule,
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./edit-page.component.css']
})

export class EditPageComponent implements OnInit {
  question_title: string= '';
  questionId: string = '';
  question_description: string = '';
  question_categories = [
    {name: 'Algorithms', selected: false},
    {name: 'Databases', selected: false},
    {name: 'Shell', selected: false},
    {name: 'Concurrency', selected: false},
    {name: 'JavaScript', selected: false},
    {name: 'pandas', selected: false},
  ];
  question_complexity: string = '';
  dropdownOpen: boolean = false;

  questionForm : FormGroup;

  constructor(
    private questionService: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.questionForm = this.fb.group({
      question_title: ['', Validators.required],
      question_description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.questionId = params['id'];
      this.loadQuestionData();
    });
  }

  loadQuestionData() {
    if (!this.questionForm.valid) {
      this.questionForm.markAllAsTouched();
    }

    this.questionService.getQuestion(this.questionId).subscribe((data: any) => {
      const questionData = data.data.data;
      this.question_title = questionData.question_title;
      this.question_description = questionData.question_description;
      const categoriesFromApi = questionData.question_categories || []; // Default to an empty array
      this.question_categories.forEach(cat => {
        cat.selected = categoriesFromApi.includes(cat.name);
      });

      this.question_complexity = questionData.question_complexity;
    });
  }

  setDifficulty(level: string) {
    this.question_complexity = level;
  }

  saveQuestion() {
    const updatedQuestion = {
      question_title: this.question_title,
      question_description: this.question_description,
      question_categories: this.question_categories.filter(cat => cat.selected).map(cat => cat.name),
      question_complexity: this.question_complexity
    };
    this.questionService.updateQuestion(this.questionId, updatedQuestion).subscribe((response) => {
        alert('Question updated successfully!');
      },
      (error) => {
        alert('Error updating question');
      }
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  navigateToList() {
    this.router.navigate(['/list-of-questions']);
  }
}

