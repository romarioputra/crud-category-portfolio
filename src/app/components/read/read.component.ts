import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryInfo } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';
import { PageService } from 'src/app/services/page.service';
import { map, startWith } from 'rxjs/operators'
import { PortfolioService } from 'src/app/services/portfolio.service';
import { Portfolio, PortfolioInfo } from 'src/app/model/portfolio';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  public success = false;
  public file!: File;
  public categories$!: Observable<Category[]>;
  public portfolios$!: Observable<Portfolio[]>
  public searchInput = new FormControl();
  public isUpdating = false;
  public updateCategoryForm = this.fb.group({
    categoryName: ['', [Validators.required]],
    categoryDesc: ['', [Validators.required]]
  })
  public updatePortfolioForm = this.fb.group({
    portfolioName: ['', [Validators.required]],
    portfolioImage: ['', [Validators.required]],
    categoryOpt: ['', [Validators.required]],
    portfolioDesc: ['', Validators.required]
  })
  constructor(public page: PageService, private category: CategoryService, private portfolio: PortfolioService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(startWith('')).subscribe((query) => {
      if (query === '') {
        this.categories$ = this.category.getCategories().pipe(
          map((categoryInfo: CategoryInfo) => categoryInfo.response.data)
        )
        this.portfolios$ = this.portfolio.getPortfolios().pipe(
          map((portfolioInfo: PortfolioInfo) => portfolioInfo.response.data)
        )
      }
      else {
        if (this.page.getCurrentSection() === 'category') {
          this.categories$ = this.category.getCategories().pipe(
            map((categoryInfo: CategoryInfo) => categoryInfo.response.data
            .filter((categories) => categories.name_category.toLowerCase().startsWith(query))),
          )
        }
        else {
          this.portfolios$ = this.portfolio.getPortfolios().pipe(
            map((portfolioInfo: PortfolioInfo) => portfolioInfo.response.data
            .filter((portfolio) => portfolio.name_portofolio.toLowerCase().startsWith(query))),
          )
        }
      }
    })
  }
  public onDeleteCategory(id: number | undefined) {
    if (typeof id === "number") {
      this.category.deleteCategory(id).subscribe(() => {
        this.categories$ = this.categories$.pipe(
          map(categories => categories.filter(category => category.id !== id))
        )
      })
    }
  }
  public onDeletePortfolio(id: number | undefined) {
    if (typeof id === "number") {
      this.portfolio.deletePortfolio(id).subscribe(() => {
        this.portfolios$ = this.portfolios$.pipe(
          map(portfolios => portfolios.filter(portfolio => portfolio.id !== id))
        )
      })
    }
  }
  private get categoryName(): FormControl {
    return this.updateCategoryForm.get('categoryName') as FormControl;
  }
  private get categoryDesc(): FormControl {
    return this.updateCategoryForm.get('categoryDesc') as FormControl;
  }
  public updateCategory(id: number | undefined): void {
    const category = {
      id: id,
      name_category: this.categoryName.value,
      desc_category: this.categoryDesc.value,
      classification_id: 1
    }
    this.category.updateCategory(category).subscribe((response) => {
      this.showSuccessStatus(response);
      
      this.categories$ = this.category.getCategories().pipe(
        map((categoryInfo: CategoryInfo) => categoryInfo.response.data)
      )
    });
  }
  public get portfolioImage(): FormControl {
    return this.updatePortfolioForm.get('portfolioImage') as FormControl;
  }
  public get portfolioName(): FormControl {
    return this.updatePortfolioForm.get('portfolioName') as FormControl;
  }  
  public get categoryOpt(): FormControl {
    return this.updatePortfolioForm.get('categoryOpt') as FormControl;
  }  
  public get portfolioDesc(): FormControl {
    return this.updatePortfolioForm.get('portfolioDesc') as FormControl;
  }
  public uploadFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }
  public onSubmitPortfolio(id: number | undefined): void {
    let formData = new FormData();
    formData.append("name_portofolio", this.portfolioName.value);
    formData.append("image_portofolio", this.file, this.file.name);
    formData.append("category_portofolio", this.categoryOpt.value);
    formData.append("desc_portofolio", this.portfolioDesc.value);
    
    this.portfolio.updatePortfolio(formData, id).subscribe((response) => {
      this.showSuccessStatus(response);
      this.portfolios$ = this.portfolio.getPortfolios().pipe(
        map((portfolioInfo: PortfolioInfo) => portfolioInfo.response.data)
      )
    })
  }
  private showSuccessStatus(response: Object) {
    const res = JSON.stringify(response);
    const resObj = JSON.parse(res);
    
    if (resObj.status === 200) {
      this.success = true;
    }
    else {
      this.success = false;
    }
  }
}
