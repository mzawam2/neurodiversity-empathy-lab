import { Component, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SimulationState {
  isActive: boolean;
  type: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  activeExperience: string | null = null;
  selectedVisionType: string = 'macular-degeneration';
  simulationClasses: { [key: string]: boolean } = {};
  simulationStates: { [key: string]: SimulationState } = {
    reading: { isActive: false, type: 'reading' },
    focus: { isActive: false, type: 'focus' },
    visual: { isActive: false, type: 'visual' }
  };
  distractionInterval: ReturnType<typeof setInterval> | null = null;
  private dyslexiaInterval: ReturnType<typeof setInterval> | null = null;
  private originalText: string = '';
  visionTypes = [
    { id: 'macular-degeneration', name: 'Macular Degeneration' },
    { id: 'glaucoma', name: 'Glaucoma' },
    { id: 'cataracts', name: 'Cataracts' },
    { id: 'diabetic-retinopathy', name: 'Diabetic Retinopathy' }
  ];

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.activeExperience) {
      this.toggleSimulation(this.activeExperience);
    }
  }

  isSimulationActive(type: string): boolean {
    return this.simulationStates[type]?.isActive || false;
  }

  toggleSimulation(type: string) {
    // First, stop any currently running simulation
    if (this.activeExperience && this.activeExperience !== type) {
      this.simulationStates[this.activeExperience].isActive = false;
      this.clearDistractions();
      this.clearDyslexiaAnimation();
    }

    const simulationState = this.simulationStates[type];
    if (!simulationState) return;

    if (simulationState.isActive) {
      // Stop simulation
      simulationState.isActive = false;
      this.activeExperience = null;
      this.clearDistractions();
      this.clearDyslexiaAnimation();
    } else {
      // Start simulation
      simulationState.isActive = true;
      this.activeExperience = type;
      
      if (type === 'focus') {
        this.startDistractions();
      } else if (type === 'reading') {
        this.startDyslexiaAnimation();
      }
    }
  }

  onVisionTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedVisionType = select.value;
    // If simulation is active, reapply the classes
    if (this.isSimulationActive('visual')) {
      this.toggleSimulation('visual');
      this.toggleSimulation('visual');
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
      distraction.style.fontSize = "1.5rem";
      distraction.style.textShadow = "0 2px 4px rgb(230, 11, 11)";
      
      const randomWords = ['Look here!', 'Notice me!', 'Hey!', 'Over Here'];
      distraction.textContent = randomWords[Math.floor(Math.random() * randomWords.length)];
      
      taskContent.appendChild(distraction);
      
      // Fade in
      setTimeout(() => {
        distraction.style.opacity = '0.7';
      }, 10);
      
      // Remove after animation
      setTimeout(() => {
        distraction.remove();
      }, 2500); 
    }, 4000); 
  }

  private clearDistractions() {
    if (this.distractionInterval) {
      clearInterval(this.distractionInterval);
      this.distractionInterval = null;
    }
  }

  private startDyslexiaAnimation() {
    this.clearDyslexiaAnimation();

    const textElement = document.querySelector('.dyslexia-simulation');
    if (!textElement) return;

    // Store original text first time
    if (!this.originalText) {
      this.originalText = textElement.textContent || '';
    }

    console.log('Starting dyslexia animation');
    console.log('Original text:', this.originalText);

    const words = this.originalText.split(' ');

    this.dyslexiaInterval = setInterval(() => {
      const scrambledWords = words.map(word => {
        if (word.length <= 3) return word;
        
        const middle = word.slice(1, -1).split('');
        for (let i = middle.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [middle[i], middle[j]] = [middle[j], middle[i]];
        }
        
        return word[0] + middle.join('') + word[word.length - 1];
      });

      console.log('Scrambled words:', scrambledWords);

      textElement.textContent = scrambledWords.join(' ');

      // Reset back to original after a short delay
      setTimeout(() => {
        textElement.textContent = this.originalText;
        console.log('Reset to original text');
      }, 500);
    }, 1000);
  }

  private clearDyslexiaAnimation() {
    if (this.dyslexiaInterval) {
      clearInterval(this.dyslexiaInterval);
      this.dyslexiaInterval = null;

      const textElement = document.querySelector('.dyslexia-simulation');
      if (textElement) {
        textElement.textContent = this.originalText;
      }
    }
  }

  ngOnDestroy() {
    this.clearDistractions();
    this.clearDyslexiaAnimation();
  }
}
