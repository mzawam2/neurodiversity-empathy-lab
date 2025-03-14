import { Component, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  activeExperience: string | null = null;
  simulationActive = false;
  simulationClasses: { [key: string]: boolean } = {};
  distractionInterval: ReturnType<typeof setInterval> | null = null;

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.activeExperience) {
      this.toggleSimulation(this.activeExperience);
    }
  }

  toggleSimulation(type: string) {
    if (this.activeExperience === type && this.simulationActive) {
      // Stop simulation
      this.simulationActive = false;
      this.activeExperience = null;
      this.clearDistractions();
    } else {
      // Start simulation
      this.simulationActive = true;
      this.activeExperience = type;
      
      if (type === 'focus') {
        this.startDistractions();
      }
    }
  }

  private startDistractions() {
    this.clearDistractions();

    const taskContent = document.querySelector('.task-content');
    if (!taskContent) return;

    this.distractionInterval = setInterval(() => {
      const distraction = document.createElement('div');
      distraction.className = 'distraction';
      distraction.style.position = 'absolute';
      distraction.style.left = Math.random() * 100 + '%';
      distraction.style.top = Math.random() * 100 + '%';
      distraction.style.transform = 'translate(-50%, -50%)';
      distraction.style.opacity = '0';
      distraction.style.transition = 'opacity 0.5s';
      distraction.style.color = "red";
      distraction.style.fontSize = "2rem";
      distraction.style.textShadow = "0 2px 4px rgb(230, 11, 11)";
      
      const randomWords = ['Focus!', 'Look here!', 'Notice me!', 'Hey!', 'Click!'];
      distraction.textContent = randomWords[Math.floor(Math.random() * randomWords.length)];
      
      taskContent.appendChild(distraction);
      
      // Fade in
      setTimeout(() => {
        distraction.style.opacity = '0.7';
      }, 10);
      
      // Remove after animation
      setTimeout(() => {
        distraction.remove();
      }, 2000);
    }, 3000);
  }

  private clearDistractions() {
    if (this.distractionInterval) {
      clearInterval(this.distractionInterval);
      this.distractionInterval = null;
    }
  }

  ngOnDestroy() {
    this.clearDistractions();
  }
}
