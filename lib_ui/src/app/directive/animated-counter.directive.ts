import {
   Directive, 
   ElementRef, 
   Input, 
   OnChanges,
   SimpleChanges
  } from '@angular/core';

@Directive({
  selector: '[animatedCounter]'
})
export class AnimatedCounterDirective implements OnChanges{

  @Input() animatedCounter!:number|string;
  @Input() duration=30;
  @Input() unit='';

  constructor(private el:ElementRef) { }

  ngOnChanges(changes:SimpleChanges){
    if(changes['animatedCounter']){
      this.animateCount();
    }
  }

  private animateCount(){
    const start=0;
    const end=Number(this.animatedCounter)||0;
    const startTime=performance.now();


    const animate=(currentTime:number)=>{
      const elapsed=currentTime-startTime;
      const progress= Math.min(elapsed/this.duration,1);
      const value=Math.floor(progress*(end-start)+start);

      this.el.nativeElement.innerText=value.toLocaleString()+(this.unit?` ${this.unit}`:'');

      if(progress<1){
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

}
