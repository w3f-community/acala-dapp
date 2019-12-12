export interface SideBarItem {
    name: string;
    path: string;
    icon?: string;
}

export interface SideBarConfig {
    products: SideBarItem[];
    socialMedia: SideBarItem[];
}
