import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslateService {

    lang = signal<'es' | 'en'>('es');

    private translations: any = {
        es: {

            header_hola: 'Hola',
            noti_vacio: 'No hay notificaciones',

            configuracion: 'Configuración',
            ajustesCuenta: 'Ajustes de la cuenta',
            subtitulo: 'Personaliza tus preferencias, privacidad, idioma y notificaciones.',
            resumen: 'Resumen',

            // Opciones principales
            preferencias: 'Preferencias',
            opcionesGenerales: 'Opciones generales',
            idioma: 'Idioma',
            guardar: 'Guardar ajustes',
            volver: 'Volver',

            // Notificaciones
            notiEmail: 'Notificaciones por email',
            notiApp: 'Notificaciones en app',
            modoOscuro: 'Modo oscuro',

            // Nuevas opciones
            recordatorios: 'Recordatorios automáticos',
            sincronizacion: 'Sincronización en la nube',
            autoguardado: 'Autoguardado',
            sonidos: 'Sonidos de la app',
            estadisticas: 'Estadísticas avanzadas',

            // Descripciones
            descNotiEmail: 'Recibe avisos importantes.',
            descNotiApp: 'Avisos dentro de la plataforma.',
            descModoOscuro: 'Ajuste visual.',
            descRecordatorios: 'Recibe alertas de tareas importantes.',
            descSincronizacion: 'Guarda tus datos en todos tus dispositivos.',
            descAutoguardado: 'Guarda automáticamente tus cambios.',
            descSonidos: 'Activa sonidos de interacción.',
            descEstadisticas: 'Muestra datos detallados.',

            // Valores dinámicos
            activadas: 'Activadas',
            desactivadas: 'Desactivadas',
            activo: 'Activo',
            inactivo: 'Inactivo',

            // Otros
            email: 'Email',
            perfil: 'Perfil',
            visible: 'Visible',
            privado: 'Privado',
            perfilPublico: 'Perfil público',
            mostrarActividad: 'Mostrar actividad',

            footer_slogan: 'Soluciones financieras con enfoque moderno, claro y seguro.',
            footer_desc: 'Ayudamos a particulares y negocios a tomar mejores decisiones económicas con herramientas digitales, seguimiento preciso y una experiencia diseñada para generar confianza.',

            footer_empresa: 'Empresa',
            footer_sobre: 'Sobre nosotros',
            footer_servicios: 'Servicios',
            footer_contacto: 'Contacto',
            footer_soporte: 'Soporte',

            footer_compromiso: 'Compromiso profesional',
            footer_compromiso_1: 'Atención cercana y especializada',
            footer_compromiso_2: 'Protección de datos y acceso seguro',
            footer_compromiso_3: 'Procesos claros y trazables',
            footer_compromiso_4: 'Mejora continua orientada al cliente',

            footer_colaboradores: 'Empresas colaboradoras',

            footer_vision: 'Visión corporativa',
            footer_vision_title: 'Una plataforma pensada para crecer contigo',
            footer_vision_desc: 'EconomicBalance combina organización financiera, seguimiento personalizado y herramientas de gestión para ofrecer una base estable sobre la que construir decisiones seguras.',

            footer_contacto_prof: 'Contacto profesional',
            footer_email: 'Email',
            footer_telefono: 'Teléfono',
            footer_horario: 'Horario',
            footer_sede: 'Sede',

            footer_privacidad: 'Política de privacidad',
            footer_terminos: 'Términos y condiciones',
            footer_cookies: 'Cookies',

            footer_copy: 'Todos los derechos reservados.',


            sidebar_inicio: 'Inicio',
            sidebar_plantillas: 'Mis Plantillas',
            sidebar_calendario: 'Calendario',
            sidebar_presupuestos: 'Presupuestos',
            sidebar_estadisticas: 'Estadísticas',
            sidebar_soporte: 'Soporte',

            sidebar_modo_oscuro: 'Modo oscuro',
            sidebar_modo_claro: 'Modo claro',
            perfil_editar: 'Editar perfil',
            perfil_ajustes: 'Ajustes',
            perfil_cerrar: 'Cerrar sesión',
            perfil_panel: 'Panel de usuario',
            perfil_editar_titulo: 'Editar perfil',
            perfil_editar_desc: 'Aquí puedes revisar y modificar todos los datos de tu cuenta, además de gestionar la seguridad desde una pantalla dedicada.',
            perfil_volver: 'Volver',

            perfil_subir_foto: 'Subir foto',
            perfil_quitar_foto: 'Quitar foto',

            perfil_sin_correo: 'Sin correo',
            perfil_sin_telefono: 'Sin teléfono',
            perfil_genero_no: 'Género no indicado',

            perfil_id_usuario: 'ID de usuario',
            perfil_estado: 'Estado',
            perfil_activo: 'Activo',
            perfil_seguridad: 'Seguridad',
            perfil_actualizable: 'Actualizable',

            perfil_info_personal: 'Información personal',
            perfil_datos_usuario: 'Datos del usuario',

            perfil_correo: 'Correo electrónico',
            perfil_nombre: 'Nombre',
            perfil_apellidos: 'Apellidos',
            perfil_numero_telefono: 'Número de teléfono',
            perfil_genero: 'Género',
            perfil_selecciona_opcion: 'Selecciona una opción',

            perfil_guardar: 'Guardar cambios',

            perfil_seguridad_titulo: 'Seguridad',
            perfil_actualizar_contra: 'Actualizar contraseña',
            perfil_actualizar_contra_desc: 'Cambia tu contraseña desde una página independiente para hacerlo de forma más clara, cómoda y segura.',
            perfil_ir_actualizar: 'Ir a actualizar contraseña',
            perfil_acceso_especifico: 'Accede a una vista específica para gestionar tu acceso.',

            perfil_proteccion: 'Protección',
            perfil_cambio_seguro: 'Cambio seguro',
            perfil_cambio_seguro_desc: 'Separa la edición del perfil de los datos sensibles.',
            perfil_mas_claridad: 'Más claridad',
            perfil_mas_claridad_desc: 'Evita mezclar información personal con acciones de seguridad.',
            perfil_acceso_rapido: 'Acceso rápido',
            perfil_acceso_rapido_desc: 'Entra directamente a la pantalla de actualización de contraseña.',

            perfil_modal_titulo: 'Cargar foto de perfil',
            perfil_modal_preview: 'Tu foto se verá aquí',
            perfil_modal_preview_desc: 'Selecciona una imagen para previsualizarla',
            perfil_modal_arrastra: 'Arrastra tu foto aquí',
            perfil_modal_o_click: 'o haz clic para seleccionar',
            perfil_modal_cancelar: 'Cancelar',
            perfil_modal_aceptar: 'Aceptar',
            perfil_modal_eliminar: 'Eliminar',
            sidebar_metas_ahorro: "Metas de Ahorro"

        },

        en: {


            noti_vacio: 'No notifications',

            header_hola: 'Hello',

            configuracion: 'Settings',
            ajustesCuenta: 'Account Settings',
            subtitulo: 'Customize your preferences, privacy, language and notifications.',
            resumen: 'Summary',

            // Main options
            preferencias: 'Preferences',
            opcionesGenerales: 'General options',
            idioma: 'Language',
            guardar: 'Save settings',
            volver: 'Back',

            // Notifications
            notiEmail: 'Email notifications',
            notiApp: 'In-app notifications',
            modoOscuro: 'Dark mode',

            // New options
            recordatorios: 'Automatic reminders',
            sincronizacion: 'Cloud sync',
            autoguardado: 'Autosave',
            sonidos: 'App sounds',
            estadisticas: 'Advanced statistics',

            // Descriptions
            descNotiEmail: 'Receive important alerts.',
            descNotiApp: 'In-app alerts.',
            descModoOscuro: 'Visual adjustment.',
            descRecordatorios: 'Receive alerts for important tasks.',
            descSincronizacion: 'Save your data across devices.',
            descAutoguardado: 'Automatically save your changes.',
            descSonidos: 'Enable interaction sounds.',
            descEstadisticas: 'Show detailed data.',

            // Dynamic values
            activadas: 'Enabled',
            desactivadas: 'Disabled',
            activo: 'Active',
            inactivo: 'Inactive',

            // Others
            email: 'Email',
            perfil: 'Profile',
            visible: 'Visible',
            privado: 'Private',
            perfilPublico: 'Public profile',
            mostrarActividad: 'Show activity',
            footer_slogan: 'Financial solutions with a modern, clear and secure approach.',
            footer_desc: 'We help individuals and businesses make better economic decisions with digital tools, precise tracking and an experience designed to inspire trust.',

            footer_empresa: 'Company',
            footer_sobre: 'About us',
            footer_servicios: 'Services',
            footer_contacto: 'Contact',
            footer_soporte: 'Support',

            footer_compromiso: 'Professional commitment',
            footer_compromiso_1: 'Close and specialized attention',
            footer_compromiso_2: 'Data protection and secure access',
            footer_compromiso_3: 'Clear and traceable processes',
            footer_compromiso_4: 'Continuous improvement focused on the client',

            footer_colaboradores: 'Partner companies',

            footer_vision: 'Corporate vision',
            footer_vision_title: 'A platform designed to grow with you',
            footer_vision_desc: 'EconomicBalance combines financial organization, personalized tracking and management tools to provide a stable foundation for safe decision-making.',

            footer_contacto_prof: 'Professional contact',
            footer_email: 'Email',
            footer_telefono: 'Phone',
            footer_horario: 'Schedule',
            footer_sede: 'Headquarters',

            footer_privacidad: 'Privacy policy',
            footer_terminos: 'Terms and conditions',
            footer_cookies: 'Cookies',

            footer_copy: 'All rights reserved.',

            sidebar_inicio: 'Home',
            sidebar_plantillas: 'My Templates',
            sidebar_calendario: 'Calendar',
            sidebar_presupuestos: 'Budgets',
            sidebar_estadisticas: 'Statistics',
            sidebar_soporte: 'Support',

            sidebar_modo_oscuro: 'Dark mode',
            sidebar_modo_claro: 'Light mode',

            perfil_editar: 'Edit profile',
            perfil_ajustes: 'Settings',
            perfil_cerrar: 'Log out',

            perfil_panel: 'User panel',
            perfil_editar_titulo: 'Edit profile',
            perfil_editar_desc: 'Here you can review and modify all your account data, as well as manage security from a dedicated screen.',
            perfil_volver: 'Back',

            perfil_subir_foto: 'Upload photo',
            perfil_quitar_foto: 'Remove photo',

            perfil_sin_correo: 'No email',
            perfil_sin_telefono: 'No phone',
            perfil_genero_no: 'Gender not specified',

            perfil_id_usuario: 'User ID',
            perfil_estado: 'Status',
            perfil_activo: 'Active',
            perfil_seguridad: 'Security',
            perfil_actualizable: 'Updatable',

            perfil_info_personal: 'Personal information',
            perfil_datos_usuario: 'User data',

            perfil_correo: 'Email',
            perfil_nombre: 'First name',
            perfil_apellidos: 'Last name',
            perfil_numero_telefono: 'Phone number',
            perfil_genero: 'Gender',
            perfil_selecciona_opcion: 'Select an option',

            perfil_guardar: 'Save changes',

            perfil_seguridad_titulo: 'Security',
            perfil_actualizar_contra: 'Update password',
            perfil_actualizar_contra_desc: 'Change your password from a separate page for a clearer, more comfortable and secure process.',
            perfil_ir_actualizar: 'Go to update password',
            perfil_acceso_especifico: 'Access a specific view to manage your login.',

            perfil_proteccion: 'Protection',
            perfil_cambio_seguro: 'Secure change',
            perfil_cambio_seguro_desc: 'Separate profile editing from sensitive data.',
            perfil_mas_claridad: 'More clarity',
            perfil_mas_claridad_desc: 'Avoid mixing personal information with security actions.',
            perfil_acceso_rapido: 'Quick access',
            perfil_acceso_rapido_desc: 'Go directly to the password update screen.',

            perfil_modal_titulo: 'Upload profile photo',
            perfil_modal_preview: 'Your photo will appear here',
            perfil_modal_preview_desc: 'Select an image to preview it',
            perfil_modal_arrastra: 'Drag your photo here',
            perfil_modal_o_click: 'or click to select',
            perfil_modal_cancelar: 'Cancel',
            perfil_modal_aceptar: 'Accept',
            perfil_modal_eliminar: 'Delete',
            sidebar_metas_ahorro: "Savings Goals"

        }
    };

    constructor() {
        const saved = localStorage.getItem('lang');
        if (saved) this.lang.set(saved as 'es' | 'en');
    }

    setLang(lang: 'es' | 'en') {
        this.lang.set(lang);
        localStorage.setItem('lang', lang);
    }

    t(key: string): string {
        return this.translations[this.lang()][key] || key;
    }
}
