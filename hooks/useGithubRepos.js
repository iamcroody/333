// hooks/useGithubRepos.js
import React, { useState, useEffect } from 'react';

export const useGithubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      setError(null);

      const users = ['ll333ll', 'iamcroody'];
      const allRepos = [];
      const seenRepos = new Set();

      for (const username of users) {
        try {
          const response = await fetch(`https://api.github.com/users/${username}/repos?type=public&sort=updated&per_page=50`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Portfolio-App'
            }
          });

          if (!response.ok) {
            console.error(`Error fetching repos for ${username}:`, response.status);
            continue;
          }

          const repos = await response.json();

          repos.forEach(repo => {
            const repoKey = `${repo.owner.login}/${repo.name}`;
            if (!seenRepos.has(repoKey)) {
              seenRepos.add(repoKey);

              const processedRepo = {
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description || 'Sin descripción disponible',
                language: repo.language,
                languagesUrl: repo.languages_url,
                stargazersCount: repo.stargazers_count,
                forksCount: repo.forks_count,
                watchersCount: repo.watchers_count,
                size: repo.size,
                defaultBranch: repo.default_branch,
                topics: repo.topics || [],
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                pushedAt: repo.pushed_at,
                htmlUrl: repo.html_url,
                cloneUrl: repo.clone_url,
                sshUrl: repo.ssh_url,
                homepage: repo.homepage,
                archived: repo.archived,
                disabled: repo.disabled,
                fork: repo.fork,
                private: repo.private,
                owner: {
                  login: repo.owner.login,
                  id: repo.owner.id,
                  avatarUrl: repo.owner.avatar_url,
                  htmlUrl: repo.owner.html_url,
                  type: repo.owner.type
                },
                status: calculateRepoStatus(repo),
                commits: null,
                languages: null
              };

              allRepos.push(processedRepo);
            }
          });
        } catch (error) {
          console.error(`Error processing repos for ${username}:`, error);
        }
      }

      // Obtener información adicional limitada para evitar rate limits
      const enhancedRepos = await Promise.all(
        allRepos.slice(0, 15).map(async (repo) => {
          try {
            // Obtener lenguajes
            const languagesResponse = await fetch(repo.languagesUrl, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-App'
              }
            });

            if (languagesResponse.ok) {
              repo.languages = await languagesResponse.json();
            }

            repo.status = calculateRepoStatus(repo);
            return repo;
          } catch (error) {
            console.error(`Error enhancing repo ${repo.fullName}:`, error);
            return repo;
          }
        })
      );

      enhancedRepos.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

      setRepos(enhancedRepos);
      setLastUpdated(new Date().toISOString());

    } catch (err) {
      console.error('Error fetching GitHub repos:', err);
      setError(err.message);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  function calculateRepoStatus(repo) {
    const now = new Date();
    const lastPush = new Date(repo.pushedAt);
    const daysSinceLastPush = (now - lastPush) / (1000 * 60 * 60 * 24);

    if (repo.archived || repo.disabled) {
      return 'Archivado';
    }

    if (daysSinceLastPush < 7) {
      return 'Activo';
    } else if (daysSinceLastPush < 30) {
      return 'En Desarrollo';
    } else if (daysSinceLastPush < 90) {
      return 'Beta';
    } else {
      return 'Concepto';
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  // Función para mapear repos de GitHub a formato de proyectos
  const mapToProjectFormat = (repo) => {
    // Mapear lenguajes a tecnologías
    const technologies = repo.languages
      ? Object.keys(repo.languages).slice(0, 8)
      : [repo.language].filter(Boolean);

    // Generar características basadas en el repo
    const features = [
      repo.description || 'Proyecto en desarrollo',
      `${repo.stargazersCount} estrellas en GitHub`,
      `${repo.forksCount} forks`,
      repo.homepage && 'Demo disponible',
      repo.topics.length > 0 && `Topics: ${repo.topics.slice(0, 3).join(', ')}`,
    ].filter(Boolean);

    // Generar desafíos típicos
    const challenges = [
      'Optimización de performance',
      'Escalabilidad del sistema',
      'Mantenimiento del código',
      repo.fork && 'Sincronización con upstream',
    ].filter(Boolean);

    // Determinar categoría basada en lenguajes y topics
    let category = 'Web Development';
    if (repo.topics.includes('ai') || repo.topics.includes('machine-learning') || repo.name.toLowerCase().includes('ai')) {
      category = 'Inteligencia Artificial';
    } else if (repo.topics.includes('security') || repo.topics.includes('cybersecurity') || repo.name.toLowerCase().includes('security')) {
      category = 'Ciberseguridad';
    } else if (repo.topics.includes('tool') || repo.topics.includes('cli') || repo.topics.includes('automation')) {
      category = 'Herramientas';
    } else if (repo.topics.includes('spiritual') || repo.topics.includes('meditation') || repo.name.toLowerCase().includes('spiritual')) {
      category = 'Espiritualidad + Tech';
    }

    // Truncar título si es muy largo
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength - 3) + '...';
    };

    return {
      id: `github-${repo.id}`,
      title: truncateText(repo.name, 25), // Mantener nombre original con truncado
      subtitle: `GitHub • ${truncateText(repo.language || 'Multi-lenguaje', 20)}`,
      description: truncateText(repo.description || 'Proyecto desarrollado y mantenido en GitHub', 120),
      longDescription: `
        <p>${repo.description || 'Proyecto desarrollado y disponible en GitHub.'}</p>
        <h3>Información del Repositorio:</h3>
        <ul>
          <li><strong>Creado:</strong> ${new Date(repo.createdAt).toLocaleDateString('es-ES')}</li>
          <li><strong>Última actualización:</strong> ${new Date(repo.updatedAt).toLocaleDateString('es-ES')}</li>
          <li><strong>Lenguaje principal:</strong> ${repo.language || 'No especificado'}</li>
          <li><strong>Tamaño:</strong> ${(repo.size / 1024).toFixed(1)} MB</li>
          ${repo.topics.length > 0 ? `<li><strong>Topics:</strong> ${repo.topics.join(', ')}</li>` : ''}
        </ul>
        ${repo.commits && repo.commits.length > 0 ? `
        <h3>Commits Recientes:</h3>
        <ul>
          ${repo.commits.slice(0, 3).map(commit =>
            `<li><strong>${new Date(commit.date).toLocaleDateString('es-ES')}:</strong> ${commit.message}</li>`
          ).join('')}
        </ul>
        ` : ''}
      `,
      status: repo.status,
      category: category,
      technologies: technologies,
      startDate: repo.createdAt,
      progress: calculateProgress(repo),
      features: features,
      challenges: challenges,
      github: repo.htmlUrl,
      demo: repo.homepage || null,
      images: [`/proyectos/github-${repo.name}-1.jpg`, `/proyectos/github-${repo.name}-2.jpg`],
      tags: [...repo.topics, repo.language?.toLowerCase(), 'github'].filter(Boolean),
      // Datos adicionales de GitHub
      githubData: {
        stars: repo.stargazersCount,
        forks: repo.forksCount,
        watchers: repo.watchersCount,
        size: repo.size,
        commits: repo.commits,
        languages: repo.languages,
        owner: repo.owner,
        isFromGithub: true
      }
    };
  };

  // Función para calcular progreso basado en actividad
  const calculateProgress = (repo) => {
    let progress = 50; // Base

    // Aumentar basado en estrellas
    progress += Math.min(repo.stargazersCount * 2, 20);

    // Aumentar basado en commits recientes
    if (repo.commits && repo.commits.length > 0) {
      progress += repo.commits.length;
    }

    // Aumentar si tiene homepage
    if (repo.homepage) progress += 10;

    // Aumentar si no es un fork
    if (!repo.fork) progress += 5;

    // Aumentar basado en el estado
    switch (repo.status) {
      case 'Activo': progress += 15; break;
      case 'En Desarrollo': progress += 10; break;
      case 'Beta': progress += 5; break;
      default: break;
    }

    return Math.min(progress, 100);
  };

  // Convertir repos a formato de proyectos
  const projectsFromGithub = React.useMemo(() => repos.map(mapToProjectFormat), [repos]);

  return {
    repos,
    projectsFromGithub,
    loading,
    error,
    lastUpdated,
    refetch: fetchRepos
  };
};