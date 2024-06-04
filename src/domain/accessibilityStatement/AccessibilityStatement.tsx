/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Breadcrumb from '../../common/components/breadcrumb/Breadcrumb';
import ExternalLink from '../../common/components/externalLink/ExternalLink';
import { ROUTES, SUPPORT_EMAIL } from '../../constants';
import useLocale from '../../hooks/useLocale';
import { Language } from '../../types';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import PageWrapper from '../app/layout/pageWrapper/PageWrapper';
import styles from './accessibilityStatement.module.scss';

const AccessibilityStatementPage: React.FC = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  const accessibilityRequirementsWebsiteUrl =
    'https://www.saavutettavuusvaatimukset.fi';
  const accessibilityRequirementsWebsiteUrlEn =
    'https://www.webaccessibility.fi/';
  const accessibilityRequirementsWebsiteUrlSv =
    'https://www.tillganglighetskrav.fi';

  const getContent = (locale: Language) => {
    switch (locale) {
      case 'en':
        return (
          <>
            <h1>Accessibility of Linked Events -web service</h1>
            <p>
              This accessibility statement explains how well the Linked Events
              web service complies with the Act on the Provision of Digital
              Services, what shortcomings there are in the accessibility of the
              online service and how you can give us feedback on accessibility
              problems.
            </p>
            <p>
              The city of Helsinki is responsible for this online service. We
              want as many users as possible to be able to access our digital
              services. We take accessibility into account in the development of
              digital services.
            </p>

            <h2>How accessible is the online service?</h2>
            <p>
              This online service partly meets the A and AA level accessibility
              criteria required by law (WCAG criteria 2.1). The online service
              has some shortcomings in accessibility, which are described in
              more detail below.
            </p>

            <h2>Did you notice any gaps in accessibility?</h2>
            <p>
              We are constantly striving to improve the accessibility of the
              online service. If you observe any issues that are not described
              on this page, please let us know and we will do our best to fix
              any shortcomings. We will respond to requests and comments as soon
              as possible, but no later than within two weeks.
            </p>
            <p>
              You can contact us by sending an email to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> / via an{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                online form
              </Link>
            </p>

            <h2>Accessibility monitoring</h2>
            <p>
              The Regional State Administrative Agency for Southern Finland
              monitors the implementation of accessibility requirements. If you
              are not satisfied with the response you have received or you do
              not receive a response at all within two weeks, you can give
              feedback to the Regional State Administrative Agency for Southern
              Finland. The website of the Regional State Administrative Agency
              for Southern Finland provides detailed information on how to file
              a complaint and how the matter will be processed.
            </p>
            <p>Regional State Administrative Agency for Southern Finland</p>
            <p>Accessibility Monitoring Unit</p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrlEn}>
                Accessibility Requirements website
              </ExternalLink>{' '}
              (in Finnish and Swedish)
            </p>
            <p>saavutettavuus(at)avi.fi</p>
            <p>Telephone (switchboard) +358 295 016 000</p>

            <h2>More detailed information on technical accessibility</h2>
            <p>The Linked Events web service is not yet fully accessible.</p>

            <h2>Content or features that are not yet accessible</h2>
            <h3>Using the service</h3>
            <ul>
              <li>
                Some dropdown menus in the service are not accessible to screen
                readers. Submitting the contact form is therefore currently not
                possible with a screen reader. (WCAG 1.3.1)
              </li>
            </ul>
            <p>
              An effort will be made to correct the shortcomings listed in this
              statement by 30.10.2024.
            </p>

            <h2>How have we tested accessibility?</h2>
            <p>
              The observations in this accessibility statement are based on a
              third-party assessment of whether the online service meets legal
              requirements.
            </p>
            <p>The online service was published on 28 November 2023.</p>
            <p>This statement was prepared on 21 November 2023.</p>
            <p>The statement was last updated on 3 June 2024.</p>
            <p>
              <ExternalLink href="https://www.finlex.fi/fi/laki/alkup/2019/20190306">
                Act on the Provision of Digital Services (306/2019)
              </ExternalLink>{' '}
              (in Finnish and Swedish)
            </p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrlEn}>
                Accessibility Requirements website
              </ExternalLink>{' '}
              (in Finnish and Swedish)
            </p>
          </>
        );
      case 'fi':
        return (
          <>
            <h1>Linked Events verkkopalvelun saavutettavuus</h1>
            <p>
              Tässä saavutettavuusselosteessa kerrotaan, miten Linked Events
              verkkopalvelu noudattaa lakia digitaalisten palvelujen
              tarjoamisesta, mitä puutteita palvelun saavutettavuudessa on ja
              miten voit antaa meille palautetta saavutettavuusongelmista.
            </p>
            <p>
              Tästä palvelusta vastaa Helsingin kaupunki. Haluamme, että
              mahdollisimman moni käyttäjä pystyy käyttämään digitaalisia
              palveluitamme. Otamme saavutettavuuden huomioon digitaalisten
              palvelujemme kehityksessä.
            </p>
            <h2>Miten saavutettava palvelu on?</h2>
            <p>
              Tämä palvelu täyttää osin lain vaatimat A- ja AA-tason
              saavutettavuuskriteerit (WCAG-kriteeristö 2.1). Palvelussa on
              joitakin saavutettavuuspuutteita, jotka on kuvattu tarkemmin
              alempana.
            </p>
            <h2>Huomasitko puutteita saavutettavuudessa?</h2>
            <p>
              Pyrimme jatkuvasti parantamaan palvelun saavutettavuutta. Jos
              löydät ongelmia, joita ei ole kuvattu tällä sivulla, ilmoita
              niistä meille ja teemme parhaamme puutteiden korjaamiseksi.
              Vastaamme 14 päivän kuluessa.
            </p>
            <p>
              Voit ottaa yhteyttä{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                verkkolomakkeella
              </Link>{' '}
              tai sähköpostitse osoitteella{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
            <h2>Saavutettavuuden valvonta</h2>
            <p>
              Etelä-Suomen aluehallintovirasto valvoo saavutettavuusvaatimusten
              toteutumista. Jos et ole tyytyväinen saamaasi vastaukseen tai et
              saa vastausta lainkaan kahden viikon aikana, voit antaa palautteen
              Etelä-Suomen aluehallintovirastoon. Etelä-Suomen
              aluehallintoviraston sivulla kerrotaan tarkasti, miten valituksen
              voi tehdä ja miten asia käsitellään.
            </p>
            <p>Etelä-Suomen aluehallintovirasto</p>
            <p>Saavutettavuuden valvonnan yksikkö</p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrl}>
                www.saavutettavuusvaatimukset.fi
              </ExternalLink>
            </p>
            <p>saavutettavuus(at)avi.fi</p>
            <p>puhelinnumero vaihde 0295 016 000</p>
            <h2>Tarkemmat tiedot teknisestä saavutettavuudesta</h2>
            <p>Palvelu ei ole vielä kaikilta osin saavutettava.</p>
            <h2>Sisällöt tai toiminnot, jotka eivät vielä ole saavutettavia</h2>
            <h3>Palvelun käyttäminen</h3>
            <ul>
              <li>
                Palvelussa on muutamia alasvetovalikoita, jotka eivät ole
                ruudunlukijalla käytettävissä. Tämän vuoksi
                yhteydenottokaavakkeen lähettäminen ei tällä hetkellä onnistu
                ruudunlukijan avulla. (WCAG 1.3.1)
              </li>
            </ul>
            <p>
              Tässä listatut puutteet pyritään korjaamaan 30.10.2024 mennessä.
            </p>
            <h2>Miten olemme testanneet saavutettavuutta?</h2>
            <p>
              Tämän saavutettavuusselosteen huomiot perustuvat kolmannen
              osapuolen arviointiin siitä, täyttääkö palvelu laissa määritellyt
              vaatimukset.
            </p>
            <p>Palvelu on julkaistu 28.11.2023.</p>
            <p>Tämä seloste on laadittu 21.11.2023.</p>
            <p>Selostetta on päivitetty viimeksi 3.6.2024.</p>
            <p>
              <ExternalLink href="https://www.finlex.fi/fi/laki/alkup/2019/20190306">
                Laki digitaalisten palvelujen tarjoamisesta (306/2019)
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrl}>
                Saavutettavuusvaatimukset-verkkosivusto
              </ExternalLink>
            </p>
          </>
        );
      case 'sv':
        return (
          <>
            <h1>Linked Events-nättjänstens tillgänglighet</h1>
            <p>
              I detta tillgänglighetsutlåtande berättas hur väl Linked
              Events-nättjänsten följer lagen om tillhandahållande av digitala
              tjänster, brister i tjänstens tillgänglighet samt hur du kan ge
              respons om tillgänglighetsproblem.
            </p>
            <p>
              Helsingfors stad ansvarar för denna tjänst. Vi vill att så många
              som möjligt ska kunna använda våra digitala tjänster. Vi beaktar
              tillgängligheten i utvecklingen av våra digitala tjänster.
            </p>
            <h2>Hur tillgänglig är tjänsten?</h2>
            <p>
              Denna tjänst uppfyller till en del A- och AA-nivåns
              tillgänglighetskriterier som nämns i lagen (WCAG-kriterierna 2.1).
              Tjänsten innehåller en del tillgänglighetsbrister som beskrivs i
              detalj nedan.
            </p>
            <h2>Märkte du brister i tillgängligheten?</h2>
            <p>
              Vi strävar till att kontinuerligt förbättra tjänstens
              tillgänglighet. Ifall du upptäcker problem som inte nämns på denna
              sida, meddela oss om dem, så gör vi vårt bästa för att åtgärda
              bristerna. Vi svarar inom 14 dagar.
            </p>
            <p>
              Du kan kontakta oss med{' '}
              <Link to={`/${locale}${ROUTES.SUPPORT_CONTACT}`}>
                onlineformulär
              </Link>{' '}
              / per e-post på adressen{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </p>
            <h2>Tillgänglighetstillsyn</h2>
            <p>
              Regionförvaltningsverket i Södra Finland övervakar förverkligandet
              av tillgänglighetskraven. Om du inte är nöjd med svaret du har
              fått eller om du inte får något svar inom 14 dagar, kan du ge
              respons till Regionförvaltningsverket i Södra Finland. På deras
              hemsidor berättas i detalj hur du kan ge respons och hur ärendet
              behandlas.
            </p>
            <p>Regionförvaltningsverket i Södra Finland</p>
            <p>Enheten för tillgänglighetstillsyn</p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrlSv}>
                www.tillganglighetskrav.fi
              </ExternalLink>
            </p>
            <p>webbtillganglighet(at)rfv.fi</p>
            <p>telefonväxel 0295 016 000</p>
            <h2>Närmare information om tekniska tillgängligheten</h2>
            <p>Tjänsten är inte ännu till alla delar tillgänglig.</p>
            <h2>Innehåll eller funktioner som inte ännu är tillgängliga</h2>
            <h3>Användning av tjänsten</h3>
            <ul>
              <li>
                Tjänsten innehåller några rullgardinsmenyer som inte är
                tillgängliga med skärmläsare. Följaktligen går det inte för
                tillfället att skicka kontaktformuläret med skärmläsare. (WCAG
                1.3.1)
              </li>
            </ul>
            <p>De uppräknade bristerna åtgärdas senast 30.10.2024.</p>

            <h2>Hur har vi testat tillgängligheten?</h2>
            <p>
              Anmärkningarna i detta tillgänglighetsutlåtande grundar sig på en
              tredje parts utvärdering om huruvida tjänsten uppfyller kraven som
              nämns i lagen.
            </p>
            <p>Tjänsten är publicerad 28.11.2023.</p>
            <p>Detta utlåtande har upprättats 21.11.2023.</p>
            <p>Utlåtandet uppdaterades senast 3.6.2024.</p>
            <p>
              <ExternalLink href="https://www.finlex.fi/sv/laki/alkup/2019/20190306">
                Lag om tillhandahållande av digitala tjänster (306/2019)
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href={accessibilityRequirementsWebsiteUrlSv}>
                Tillgänglighetskrav-webbplatsen
              </ExternalLink>
            </p>
          </>
        );
    }
  };

  const pageTitle = t('accessibilityStatementPage.pageTitle');

  return (
    <PageWrapper titleText={pageTitle}>
      <MainContent className={styles.accessibilityStatementPage}>
        <Container withOffset>
          <Breadcrumb
            list={[
              { title: t('common.home'), path: ROUTES.HOME },
              { title: pageTitle, path: null },
            ]}
          />
          {getContent(locale)}
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default AccessibilityStatementPage;
