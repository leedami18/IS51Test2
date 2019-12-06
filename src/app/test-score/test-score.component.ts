import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  nameInput = '';

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadTests();
  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {

    } else {
      tests = await this.loadTestsFromJson();
    }
    this.tests = tests;
    return tests;
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null
    };
    this.tests.push(test);
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
    this.toastService.showToast('success', 3000, 'Success: Items saved!');
  }

  deleteTest() {
    this.tests.splice(-1, 1);
    this.saveToLocalStorage();
    // fix validation
  }
  computeGrade() {
    console.log('nameInput', this.nameInput);

    if (this.nameInput === '') {
      this.toastService.showToast('warning', 5000, 'name must not be null');
    } else if (this.nameInput.indexOf(',') === -1) {
      this.toastService.showToast('warning', 5000, 'name must have a ,');
    } else {
      const data = this.calculate();
      this.router.navigate(['home', data]);
    }
  }

  calculate() {
    let totals = 0, earned = 0;
    for (let i = 0; i < this.tests.length; i++) {
      totals += this.tests[i].pointsPossible;
      earned += this.tests[i].pointsReceived;
    }
    return {
      totalPoints: totals,
      totalRecieved: earned,
    };

  }

}
