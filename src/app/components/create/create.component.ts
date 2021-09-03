import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category, CategoryInfo } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';
import { PageService } from 'src/app/services/page.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  @Input() public prevPage: string = "";
  public file!: File;
  public success = false;
  public categories$!: Observable<Category[]>
  public categoryOpts: Category[] = [];
  public createCategoryForm = this.fb.group({
    categoryName: ['', [Validators.required]],
    categoryDesc: ['', [Validators.required]]
  });
  public createPortfolioForm = this.fb.group({
    portfolioName: ['', [Validators.required]],
    portfolioImage: ['', [Validators.required]],
    categoryOpt: ['', [Validators.required]],
    portfolioDesc: ['', Validators.required]
  })
  constructor(public page: PageService, private category: CategoryService, private portfolio: PortfolioService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.categories$ = this.category.getCategories().pipe(
      map((categoryInfo: CategoryInfo) => {
        this.categoryOpts = categoryInfo.response.data;
        return categoryInfo.response.data;
      })
    )
  }

  private get categoryName(): FormControl {
    return this.createCategoryForm.get('categoryName') as FormControl;
  }
  private get categoryDesc(): FormControl {
    return this.createCategoryForm.get('categoryDesc') as FormControl;
  }

  public onSubmitCategory(): void {
    const newCategory: Category = {
      name_category: this.categoryName.value,
      desc_category: this.categoryDesc.value,
      classification_id: 1
    }
    this.category.createCategory(newCategory).subscribe((response) => {
      this.showSuccessStatus(response);
    })
  }

  public get portfolioImage(): FormControl {
    return this.createPortfolioForm.get('portfolioImage') as FormControl;
  }
  public get portfolioName(): FormControl {
    return this.createPortfolioForm.get('portfolioName') as FormControl;
  }  
  public get categoryOpt(): FormControl {
    return this.createPortfolioForm.get('categoryOpt') as FormControl;
  }  
  public get portfolioDesc(): FormControl {
    return this.createPortfolioForm.get('portfolioDesc') as FormControl;
  }
  public uploadFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }
  public onSubmitPortfolio(): void {
    let formData = new FormData();
    formData.append("name_portofolio", this.portfolioName.value);
    formData.append("image_portofolio", this.file, this.file.name);
    formData.append("category_portofolio", this.categoryOpt.value);
    formData.append("desc_portofolio", this.portfolioDesc.value);
    
    this.portfolio.createPortfolio(formData).subscribe((response) => {
      this.showSuccessStatus(response);
      console.log(response);
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
