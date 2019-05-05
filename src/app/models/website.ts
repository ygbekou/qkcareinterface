
export class Section {
  id: number;
  name: string;
  title: string;
  description: string;
  fileLocation: string;
  status: number;
  showInMenu: string;
  language: string;
  sectionLabel: string;

  constructor() {
      this.fileLocation = '';
  }
}


export class SectionItem {
    id: number;
    section: Section;
    title: string;
    description: string;
    fileLocation: string;
    status: number;
    showInMenu: string;
    language: string;

    text1: string;
    text2: string;
    text3: string;

     constructor() {
      this.fileLocation = '';
    }
  }

 export class ContactUsMessage {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
  }

 export class Slider {
  id: number;
  name:  '';
  fileLocation: string;
  status: number;

  constructor() {
      this.fileLocation = '';
  }

}

 export class SliderText {
  id: number;
  slider: Slider;
  text1: ''; 
  text2: '';
  text3: '';
  language: string;

}
