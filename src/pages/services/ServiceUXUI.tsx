import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServiceUXUI() {
  return (
    <ServicePage
      title="Diseño UX/UI"
      metaTitle="Agencia de Diseño UX/UI en Santiago, Chile | PLANOZERO"
      metaDescription="Diseñamos interfaces que tienen lógica, no solo forma. Arquitectura de información, sistemas de diseño y prototipos de alta fidelidad para productos digitales en Chile."
      canonical="https://www.planozero.cl/diseno-ux-ui"
      schemaService="Servicio de Diseño UX/UI"
      tag="Experiencia de Usuario · Santiago, Chile"
      headline={<>Diseño UX/UI<br /><span className="text-[#FF5F1F]">que tiene lógica</span></>}
      subheadline="Diseñamos interfaces que funcionan antes de que alguien las vea. Cada decisión tiene una razón — de arquitectura, de flujo, de contexto — no solo de estética."
      intro={
        <>
          <p>
            Hay muchas agencias que hacen pantallas bonitas. Nosotros hacemos pantallas que la gente entiende sin que nadie les explique nada. Esa diferencia, que parece pequeña, es lo que separa un producto digital que convierte de uno que frustra.
          </p>
          <p>
            Trabajamos con equipos de producto, startups que están construyendo su primera versión y empresas que tienen un sistema que heredaron y que ya no da para más. En los tres casos, el proceso parte igual: entendiendo a quién va dirigido el producto y qué problema real tiene que resolver.
          </p>
          <p>
            No partimos del Figma. Partimos de las preguntas incómodas que nadie quiere hacer en una reunión de kickoff.
          </p>
        </>
      }
      points={[
        {
          title: 'Arquitectura de Información',
          desc: 'Organizamos el contenido y los flujos antes de tocar el diseño. Mapas de sitio, flujos de usuario, jerarquías de navegación que tienen sentido para quien usa el producto — no para quien lo construyó.'
        },
        {
          title: 'Wireframing y Prototipado',
          desc: 'Primero baja resolución, después alta fidelidad. Testeamos los flujos críticos con prototipos navegables antes de pasar al diseño final. Es más barato equivocarse en papel que en código.'
        },
        {
          title: 'Sistemas de Diseño Atómico',
          desc: 'Componentes, variantes, tokens de diseño. Un sistema que el equipo de desarrollo puede implementar sin traducción y que escala cuando el producto crece.'
        },
        {
          title: 'Interfaces Responsivas',
          desc: 'Diseñamos mobile-first de verdad, no como afterthought. Cada pantalla pensada para el contexto en que se va a usar — táctil, escritorio, pantalla grande.'
        },
        {
          title: 'Handoff a Desarrollo',
          desc: 'Entregamos archivos de Figma con especificaciones completas, tokens exportables y documentación de componentes. El desarrollador no tiene que adivinar nada.'
        },
        {
          title: 'Tests de Usabilidad',
          desc: 'Sesiones con usuarios reales antes del lanzamiento. Identificamos los puntos de fricción que nunca se ven desde adentro del equipo.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Descubrimiento',
          desc: 'Entendemos el negocio, al usuario y las restricciones reales del proyecto. Revisamos analytics si existen, hablamos con el equipo, y a veces con usuarios actuales. No asumimos nada.'
        },
        {
          num: '02',
          title: 'Arquitectura y flujos',
          desc: 'Definimos cómo se organiza la información y cómo se mueve el usuario entre las pantallas. Presentamos en wireframes de baja fidelidad para validar antes de seguir.'
        },
        {
          num: '03',
          title: 'Diseño de interfaz',
          desc: 'Construimos el sistema visual sobre la arquitectura aprobada. Colores, tipografía, espaciado, estados de componentes — todo documentado en un sistema coherente.'
        },
        {
          num: '04',
          title: 'Prototipo y tests',
          desc: 'Armamos un prototipo navegable y lo testeamos. Si algo no funciona, lo arreglamos antes de que el desarrollo lo construya.'
        },
        {
          num: '05',
          title: 'Entrega y soporte',
          desc: 'Entregamos los archivos, explicamos las decisiones de diseño y acompañamos al equipo de desarrollo durante la implementación.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto tarda un proyecto de diseño UX/UI?',
          a: 'Depende del alcance. Un flujo crítico puede tomar 2-3 semanas. Un sistema de diseño completo para un producto digital puede tomar 6-10 semanas. Siempre definimos tiempos reales al inicio del proyecto, no estimaciones optimistas.'
        },
        {
          q: '¿Trabajan con equipos que ya tienen un producto lanzado?',
          a: 'Sí, y es un escenario común. Si ya tienen usuarios, tenemos datos reales para trabajar. Si el producto tiene problemas de usabilidad, hacemos una auditoría primero para entender qué está fallando antes de proponer cambios.'
        },
        {
          q: '¿Entregan código o solo diseño?',
          a: 'Nuestro trabajo termina en el handoff de Figma con especificaciones completas. Si necesitan que alguien implemente el diseño, tenemos equipo de desarrollo o podemos coordinar con el suyo.'
        },
        {
          q: '¿Qué herramientas usan?',
          a: 'Figma para diseño y prototipado. FigJam o Miro para talleres de arquitectura. Maze o Lookback para tests de usabilidad. Todo en la nube, accesible para el cliente desde el primer día.'
        },
        {
          q: '¿Tienen experiencia en apps móviles?',
          a: 'Sí. Diseñamos para iOS y Android siguiendo las guías de Human Interface Guidelines y Material Design cuando corresponde, pero siempre priorizando la coherencia del producto sobre seguir las guías al pie de la letra.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto tarda un proyecto de diseño UX/UI?', a: 'Depende del alcance. Un flujo crítico puede tomar 2-3 semanas. Un sistema de diseño completo puede tomar 6-10 semanas.' },
        { q: '¿Trabajan con equipos que ya tienen un producto lanzado?', a: 'Sí. Si ya tienen usuarios, tenemos datos reales para trabajar.' },
        { q: '¿Entregan código o solo diseño?', a: 'Nuestro trabajo termina en el handoff de Figma con especificaciones completas.' },
        { q: '¿Qué herramientas usan?', a: 'Figma para diseño y prototipado, FigJam para talleres de arquitectura, Maze para tests de usabilidad.' },
      ]}
      relatedLinks={[
        { label: 'Agencia de Branding', href: '/agencia-branding' },
        { label: 'Desarrollo Web', href: '/diseno-web' },
        { label: 'Marketing Digital', href: '/agencia-marketing-digital' },
      ]}
    />
  );
}
