import React from 'react';
import { ServicePage } from './ServiceLayout';

export default function ServicePublicidad() {
  return (
    <ServicePage
      title="Agencia de Publicidad"
      metaTitle="Agencia de Publicidad Digital en Santiago, Chile | PLANOZERO"
      metaDescription="PLANOZERO es una agencia de publicidad digital en Santiago, Chile. Campañas de Google Ads, Meta Ads y publicidad programática con foco en resultados medibles."
      canonical="https://www.planozero.cl/agencia-publicidad"
      schemaService="Servicio de Publicidad Digital"
      tag="Publicidad Digital · Santiago, Chile"
      headline={
        <>
          Publicidad digital<br />
          <span className="text-[#FF5F1F]">que se justifica</span>
        </>
      }
      subheadline="Creamos y gestionamos campañas de pauta digital con un criterio claro: cada peso invertido tiene que tener sentido. No corremos ads sin estrategia."
      intro={
        <>
          <p>
            La publicidad digital tiene un problema de imagen, y es en parte culpa de quienes la hacen. Demasiadas agencias que te muestran impresiones y alcance como si fueran resultados. Demasiados reportes de 40 páginas que no dicen si el negocio vendió más.
          </p>
          <p>
            Nuestra forma de trabajar parte de una pregunta simple: ¿qué tiene que pasar para que esta campaña valga la pena? La respuesta puede ser leads, ventas, registros o visitas a una tienda física. Pero tiene que ser algo concreto y medible. Desde ahí construimos la campaña, elegimos los canales y definimos cómo vamos a saber si está funcionando.
          </p>
          <p>
            Trabajamos con presupuestos reales. No con presupuestos de agencias internacionales. Sabemos cómo hacer rendir la inversión en el mercado chileno, con los tickets de venta y los comportamientos de compra que tiene ese mercado.
          </p>
        </>
      }
      points={[
        {
          title: 'Google Ads',
          desc: 'Search, Display y YouTube. Capturamos demanda existente: gente que ya está buscando lo que vendés. Configuración de cuentas, selección de palabras clave, optimización de calidad y seguimiento de conversiones real.'
        },
        {
          title: 'Meta Ads (Facebook e Instagram)',
          desc: 'Campañas de generación de demanda para audiencias que aún no te conocen. Segmentación detallada, creatividades que funcionan y seguimiento de resultados más allá del engagement.'
        },
        {
          title: 'Publicidad Programática',
          desc: 'Display y video en inventario premium fuera de Google. Para campañas de awareness con control de frecuencia y audiencias más precisas que la Red de Display tradicional.'
        },
        {
          title: 'LinkedIn Ads',
          desc: 'Para negocios B2B que venden a empresas o a profesionales. El canal caro que vale la pena cuando el ticket de venta lo justifica y el targeting por cargo/industria es crítico.'
        },
        {
          title: 'Creatividad para Pauta',
          desc: 'Piezas diseñadas para funcionar como anuncios, no adaptadas de materiales de branding. Copy directo, formatos nativos por canal y A/B testing sistemático.'
        },
        {
          title: 'Medición y Atribución',
          desc: 'Configuración correcta de Google Tag Manager, GA4 y píxeles. Sin esto, no se puede saber qué canal vende de verdad. Es el primer paso antes de gastar un peso en pauta.'
        },
      ]}
      process={[
        {
          num: '01',
          title: 'Diagnóstico',
          desc: 'Revisamos el estado de las cuentas existentes si las hay, la configuración de analítica, el historial de campañas y qué resultados se obtuvieron con qué inversión. Si no hay cuentas, partimos desde cero con la configuración correcta.'
        },
        {
          num: '02',
          title: 'Estrategia de medios',
          desc: 'Definimos qué canales usar, cómo dividir el presupuesto, qué audiencias atacar en cada canal y qué métricas de éxito vamos a usar. Todo por escrito antes de activar.'
        },
        {
          num: '03',
          title: 'Producción de creatividades',
          desc: 'Diseñamos las piezas necesarias para las campañas: banners, videos cortos, copys de anuncios. Formatos adaptados a cada canal y a los comportamientos de cada audiencia.'
        },
        {
          num: '04',
          title: 'Lanzamiento y aprendizaje',
          desc: 'Los primeros 30 días son de aprendizaje. Las campañas necesitan datos para optimizar. Monitoreamos a diario y hacemos ajustes rápidos cuando algo no está funcionando.'
        },
        {
          num: '05',
          title: 'Optimización y escala',
          desc: 'Con datos suficientes, optimizamos bids, audiencias y creatividades. Lo que convierte escala. Lo que no convierte se pausa. Así de simple, así de directo.'
        },
      ]}
      faqs={[
        {
          q: '¿Cuánto presupuesto mínimo necesito para hacer publicidad digital?',
          a: 'Para Google Ads recomendamos mínimo $200.000-300.000 CLP mensuales de inversión en medios para tener datos suficientes. Para Meta Ads, similar. Con menos presupuesto el algoritmo no tiene suficiente información para optimizar bien y los resultados son poco representativos.'
        },
        {
          q: '¿Cuánto cobran de gestión?',
          a: 'Nuestro fee de gestión va entre el 15% y 20% de la inversión en medios, con un mínimo mensual. Lo acordamos antes de empezar y está en el contrato. No hay cobros ocultos ni por "horas extra de optimización".'
        },
        {
          q: '¿Las cuentas de ads quedan a mi nombre?',
          a: 'Siempre. Las cuentas de Google Ads y Meta Ads se crean a nombre del cliente o se accede a las existentes por invitación. Si en algún momento cambiás de agencia, te llevás todo el historial y la configuración. Es tu inversión, son tus datos.'
        },
        {
          q: '¿Pueden hacer publicidad para e-commerce?',
          a: 'Sí, y tiene sus particularidades. Shopping Ads en Google, catálogos en Meta, remarketing dinámico. Para e-commerce la medición es más directa porque las ventas son rastreables, lo que hace más fácil optimizar en base a ROAS real.'
        },
        {
          q: '¿Con cuánta anticipación hay que planificar una campaña?',
          a: 'Para una campaña con creatividades nuevas, necesitamos al menos 2 semanas de anticipación. Para campañas estacionales importantes (Cyber Monday, navidad, etc.), idealmente un mes. Campañas de urgencia se pueden activar más rápido, pero la calidad se resiente.'
        },
      ]}
      faqSchema={[
        { q: '¿Cuánto presupuesto mínimo necesito para publicidad digital?', a: 'Recomendamos mínimo $200.000-300.000 CLP mensuales de inversión en medios para tener datos suficientes para optimizar.' },
        { q: '¿Las cuentas de ads quedan a mi nombre?', a: 'Siempre. Si cambiás de agencia, te llevás todo el historial y la configuración.' },
        { q: '¿Pueden hacer publicidad para e-commerce?', a: 'Sí. Shopping Ads, catálogos en Meta y remarketing dinámico, midiendo ROAS real.' },
      ]}
      relatedLinks={[
        { label: 'Marketing Digital',      href: '/agencia-marketing-digital' },
        { label: 'Agencia de Branding',    href: '/agencia-branding' },
        { label: 'Diseño Web',             href: '/diseno-web' },
      ]}
    />
  );
}
