export class FerryRoute {
    route: TimeRoute = new TimeRoute();
}

export class TimeRoute {
    isOnTime: boolean = true;
    isFull: boolean = false;
    color_isOntime: string = 'dark';
    color_isFull: string = 'dark';
    time_depart: string = '';
    departure_a: any;
    departure_b: any;
    boarding_a: any;
    boarding_b: any;
    priority: string;
    name: string;
}
